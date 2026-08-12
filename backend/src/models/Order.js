import mongoose from "mongoose";

// A line is a frozen snapshot of what was ordered: prices are copied in by the
// server at order time so a later rate-card change never rewrites history.
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    packLabel: { type: String, required: true }, // "500 g pack" / "10 kg case"
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true },
    chain: { type: String, required: true }, // chilled / frozen / ambient-cured
    isPreOrder: { type: Boolean, default: false },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    track: {
      type: String,
      required: true,
      enum: ["retail", "wholesale"],
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(v) => v.length > 0, "Order must have at least one item"],
    },
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      address: { type: String, required: true },
      city: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    // wholesale only — copied off the approved account at order time
    business: {
      accountKey: { type: String, default: "" },
      legalName: { type: String, default: "" },
      gstin: { type: String, default: "" },
      fssai: { type: String, default: "" },
      poReference: { type: String, default: "" },
      paymentTerms: { type: String, default: "" },
    },
    // retail: "Sat 07:00–10:00" slot. wholesale: standing delivery window.
    deliverySlot: {
      type: String,
      required: true,
    },
    isStandingOrder: {
      type: Boolean,
      default: false, // wholesale repeat/standing order
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "packed",
        "dispatched",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true } //createdAt, updatedAt
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
