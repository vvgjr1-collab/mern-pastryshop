import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon, ShoppingCartIcon, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EmptyState from "../components/EmptyState";
import ChainBadge from "../components/ChainBadge";
import { getCart, updateQuantity, removeFromCart, clearCart } from "../lib/cart";
import { formatINR } from "../lib/utils";
import { RETAIL, WHOLESALE } from "../lib/trade";

const CartPage = () => {
  const [cart, setCart] = useState(getCart());
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setCart(getCart());
    window.addEventListener("cart:updated", sync);
    return () => window.removeEventListener("cart:updated", sync);
  }, []);

  const isWholesale = cart.track === "wholesale";
  const subtotal = cart.lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0
  );
  const minimum = isWholesale ? WHOLESALE.minOrderValue : RETAIL.minCartValue;
  const shortfall = minimum - subtotal;
  const deliveryFee =
    isWholesale || subtotal >= RETAIL.freeDeliveryOver ? 0 : RETAIL.deliveryFee;

  // Different chains ship in different boxes — worth saying before checkout.
  const chains = [...new Set(cart.lines.map((line) => line.chain))];

  if (cart.lines.length === 0) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <EmptyState
          icon={ShoppingCartIcon}
          title="Your order is empty"
          message="Pick a cut from the catalogue — every page tells you how to cook it."
          actionLabel="Browse the catalogue"
          actionTo="/catalogue"
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/catalogue" className="btn btn-ghost">
              <ArrowLeftIcon className="size-5" />
              Keep shopping
            </Link>
            <button
              className="btn btn-ghost btn-sm text-error"
              onClick={() => {
                clearCart();
                toast.success("Order cleared");
              }}
            >
              Clear
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <h1 className="card-title text-2xl">
                {isWholesale ? "Wholesale order" : "Your basket"}
              </h1>
              <p className="text-sm text-base-content/60">
                {isWholesale
                  ? `Case pricing · minimum ${formatINR(
                      WHOLESALE.minOrderValue
                    )} per drop · cut-off ${WHOLESALE.orderCutOff}`
                  : `Retail packs · minimum cart ${formatINR(
                      RETAIL.minCartValue
                    )} · free delivery over ${formatINR(RETAIL.freeDeliveryOver)}`}
              </p>

              <div className="divide-y divide-base-content/10 mt-4">
                {cart.lines.map((line) => (
                  <div
                    key={line.productId}
                    className="py-4 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <span className="text-3xl">{line.image}</span>

                    <div className="flex-1">
                      <Link
                        to={`/product/${line.productId}`}
                        className="font-medium hover:text-primary"
                      >
                        {line.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="font-mono text-xs text-base-content/50">
                          {line.sku}
                        </span>
                        <ChainBadge chain={line.chain} />
                        {line.isPreOrder && (
                          <span className="badge badge-warning badge-sm">
                            Pre-order
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-base-content/60 mt-1">
                        {formatINR(line.unitPrice)} / {line.packLabel}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={line.minQty || 1}
                        className="input input-bordered input-sm w-20"
                        value={line.quantity}
                        onChange={(e) => {
                          const next = Number(e.target.value);
                          if (next < (line.minQty || 1)) {
                            toast.error(
                              `Minimum for this SKU is ${line.minQty} ${
                                isWholesale ? "case(s)" : "pack(s)"
                              }`
                            );
                            return;
                          }
                          updateQuantity(line.productId, next);
                        }}
                      />
                      <span className="w-24 text-right font-medium">
                        {formatINR(line.unitPrice * line.quantity)}
                      </span>
                      <button
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => removeFromCart(line.productId)}
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {chains.length > 1 && (
                <div className="alert alert-info mt-4 text-sm">
                  <span>
                    This order spans {chains.length} cold chains — it will arrive
                    in separate boxes with separate handling instructions.
                  </span>
                </div>
              )}

              <div className="mt-6 space-y-1 text-right">
                <p className="text-base-content/70">
                  Subtotal <strong>{formatINR(subtotal)}</strong>
                </p>
                <p className="text-base-content/70">
                  Delivery{" "}
                  <strong>
                    {deliveryFee === 0 ? "Included" : formatINR(deliveryFee)}
                  </strong>
                </p>
                <p className="text-xl font-bold text-primary">
                  Total {formatINR(subtotal + deliveryFee)}
                </p>
              </div>

              {shortfall > 0 && (
                <div className="alert alert-warning mt-4">
                  <span>
                    {formatINR(shortfall)} short of the{" "}
                    {isWholesale ? "wholesale minimum order value" : "minimum cart value"}{" "}
                    ({formatINR(minimum)}).
                  </span>
                </div>
              )}

              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-primary"
                  disabled={shortfall > 0}
                  onClick={() => navigate("/checkout")}
                >
                  Continue to checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
