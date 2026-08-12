import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import { RETAIL, WHOLESALE } from "../config/trade.js";

// SOP-20260812-4F2A
function makeOrderNumber() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(d.getDate()).padStart(2, "0")}`;
  const tail = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SOP-${stamp}-${tail}`;
}

export async function getAllOrders(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); //newest first
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getAllOrders controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found!" });
    res.json(order);
  } catch (error) {
    console.error("Error in getOrderById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Prices, pack labels and MOQ are all resolved server-side from the database.
// The client only ever says "this product, this many".
export async function createOrder(req, res) {
  try {
    const {
      userId,
      items,
      customer,
      deliverySlot,
      notes,
      poReference,
      isStandingOrder,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Your order is empty" });
    }
    if (!customer?.name || !customer?.phone || !customer?.address) {
      return res
        .status(400)
        .json({ message: "Name, phone and address are required" });
    }
    if (!deliverySlot) {
      return res
        .status(400)
        .json({ message: "Pick a delivery slot before ordering" });
    }

    const track = req.track; // "retail" unless an approved account key was sent
    const isWholesale = track === "wholesale";

    const orderItems = [];
    const stockUpdates = [];

    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!item.productId || !Number.isFinite(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Invalid line item" });
      }

      let product = null;

      if (mongoose.Types.ObjectId.isValid(item.productId)) {
        product = await Product.findById(item.productId);
      }

      if (!product && item.sku) {
        product = await Product.findOne({
          sku: String(item.sku).trim().toUpperCase(),
        });
      }

      if (!product || !product.isActive) {
        return res.status(404).json({
          message: `Product no longer available: ${item.sku || item.productId}`,
        });
      }

      const isPreOrder =
        product.seasonal?.isSeasonal && product.seasonal?.preOrderOpen;

      let unitPrice;
      let packLabel;

      if (isWholesale) {
        const moq = product.wholesale.moqCases || 1;
        if (quantity < moq) {
          return res.status(400).json({
            message: `${product.name}: minimum order is ${moq} case(s)`,
          });
        }
        if (!isPreOrder && quantity > product.wholesale.stockCases) {
          return res.status(400).json({
            message: `${product.name}: only ${product.wholesale.stockCases} case(s) in stock`,
          });
        }
        unitPrice = product.wholesale.pricePerKg * product.wholesale.caseSizeKg;
        packLabel = `${product.wholesale.caseSizeKg} kg case`;
        stockUpdates.push({
          product,
          field: "wholesale.stockCases",
          quantity,
          isPreOrder,
        });
      } else {
        if (!isPreOrder && quantity > product.retail.stockPacks) {
          return res.status(400).json({
            message: `${product.name}: only ${product.retail.stockPacks} pack(s) in stock`,
          });
        }
        unitPrice = product.retail.price;
        packLabel = `${product.retail.packSizeG} g pack`;
        stockUpdates.push({
          product,
          field: "retail.stockPacks",
          quantity,
          isPreOrder,
        });
      }

      orderItems.push({
        product: product._id,
        sku: product.sku,
        name: product.name,
        packLabel,
        unitPrice,
        quantity,
        lineTotal: unitPrice * quantity,
        chain: product.chain,
        isPreOrder: !!isPreOrder,
      });
    }

    const subtotal = orderItems.reduce((sum, line) => sum + line.lineTotal, 0);

    if (isWholesale && subtotal < WHOLESALE.minOrderValue) {
      return res.status(400).json({
        message: `Wholesale minimum order value is ₹${WHOLESALE.minOrderValue}. Your order is ₹${subtotal}.`,
      });
    }
    if (!isWholesale && subtotal < RETAIL.minCartValue) {
      return res.status(400).json({
        message: `Minimum cart value is ₹${RETAIL.minCartValue}. Your cart is ₹${subtotal}.`,
      });
    }

    const deliveryFee =
      isWholesale || subtotal >= RETAIL.freeDeliveryOver
        ? 0
        : RETAIL.deliveryFee;

    const order = new Order({
      orderNumber: makeOrderNumber(),
      userId,
      track,
      items: orderItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      customer,
      business: isWholesale
        ? {
            accountKey: req.account.accountKey,
            legalName: req.account.businessName,
            gstin: req.account.gstin,
            fssai: req.account.fssai,
            poReference: poReference || "",
            paymentTerms: req.account.creditTerms,
          }
        : {},
      deliverySlot,
      isStandingOrder: isWholesale ? !!isStandingOrder : false,
      notes: notes || "",
    });

    const savedOrder = await order.save();

    // only touch stock once the order is safely written
    for (const update of stockUpdates) {
      if (update.isPreOrder) continue; // pre-orders are booked against future stock
      await Product.findByIdAndUpdate(update.product._id, {
        $inc: { [update.field]: -update.quantity },
      });
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error in createOrder controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateOrder(req, res) {
  try {
    const { status, notes } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      {
        new: true, // Return the updated document
      }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error in updateOrder controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Buyers cancel, they don't delete: an order that was picked is a record.
export async function cancelOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (["dispatched", "delivered"].includes(order.status)) {
      return res.status(400).json({
        message:
          "This order has already left the cold room — call your account contact",
      });
    }
    if (order.status === "cancelled") {
      return res.json({ message: "Order already cancelled", order });
    }

    order.status = "cancelled";
    await order.save();

    // put the stock back
    for (const line of order.items) {
      if (line.isPreOrder) continue;
      const field =
        order.track === "wholesale"
          ? "wholesale.stockCases"
          : "retail.stockPacks";
      await Product.findByIdAndUpdate(line.product, {
        $inc: { [field]: line.quantity },
      });
    }

    res.json({ message: "Order cancelled", order });
  } catch (error) {
    console.error("Error in cancelOrder controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
