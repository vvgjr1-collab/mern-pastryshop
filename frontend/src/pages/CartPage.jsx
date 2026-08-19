import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EmptyState from "../components/EmptyState";
import Hatch from "../components/Hatch";
import { getCart, updateQuantity, removeFromCart, clearCart } from "../lib/cart";
import { formatINR } from "../lib/utils";
import { CHAINS, RETAIL, WHOLESALE } from "../lib/trade";

// Perishable checkout has one job the grocery pattern misses: the slot is part
// of the product. Chilled and frozen lines are counted separately here, and the
// cold-pack line is priced openly at checkout rather than buried.
const CartPage = () => {
  const [cart, setCart] = useState(getCart());
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setCart(getCart());
    window.addEventListener("cart:updated", sync);
    return () => window.removeEventListener("cart:updated", sync);
  }, []);

  const isWholesale = cart.track === "wholesale";
  const subtotal = cart.lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const units = cart.lines.reduce((s, l) => s + l.quantity, 0);
  const minimum = isWholesale ? WHOLESALE.minOrderValue : RETAIL.minCartValue;
  const shortfall = minimum - subtotal;
  const deliveryFee =
    isWholesale || subtotal >= RETAIL.freeDeliveryOver ? 0 : RETAIL.deliveryFee;

  const byChain = cart.lines.reduce((acc, l) => {
    acc[l.chain] = (acc[l.chain] || 0) + l.quantity;
    return acc;
  }, {});
  const mixLine = Object.entries(byChain)
    .map(([chain, n]) => `${n} ${CHAINS[chain]?.label.toLowerCase()}`)
    .join(" · ");

  if (cart.lines.length === 0) {
    return (
      <div className="min-h-screen bg-sop-bone-100">
        <Navbar />
        <EmptyState
          title="Nothing in the cart"
          message="The counter is open — pork, charcuterie, steak, seafood and poultry, every cut with its cooking note."
          actionLabel="Shop the counter"
          actionTo="/catalogue"
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sop-bone-100">
      <Navbar />

      <div className="grid lg:grid-cols-[1fr_430px]">
        {/* --------------------------- lines --------------------------- */}
        <div className="border-b border-sop-bone-300 px-4 pb-8 pt-6 lg:border-b-0 lg:border-r lg:px-10 lg:pb-12 lg:pt-10">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <div>
              <h1 className="font-display text-[38px] leading-[.98] text-sop-ink lg:text-[52px] lg:leading-[.96]">
                {isWholesale ? "Wholesale order" : "Your order"}
              </h1>
              <span className="mt-1 block font-plex text-[11.5px] leading-[1.5] text-sop-ink-50 lg:text-xs">
                {mixLine} · packed separately
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                clearCart();
                toast.success("Order cleared");
              }}
              className="whitespace-nowrap border-b border-sop-bone-400 pb-0.5 font-plex text-[10.5px] leading-none text-sop-ink-50 hover:text-sop-ink"
            >
              Clear
            </button>
          </div>

          <div>
            {cart.lines.map((line) => (
              <div
                key={line.productId}
                className="flex items-center gap-3.5 border-t border-sop-bone-300 py-4 lg:gap-[18px] lg:py-[18px]"
              >
                <Hatch className="h-[78px] w-[78px] flex-none lg:h-[104px] lg:w-[104px]" />

                <div className="flex flex-1 flex-col gap-1.5">
                  <Link
                    to={`/product/${line.productId}`}
                    className="font-display text-[20px] leading-[1.05] text-sop-ink hover:text-sop-ember lg:text-[26px]"
                  >
                    {line.name}
                  </Link>
                  <span className="font-plex text-[10.5px] leading-[1.5] text-sop-ink-50 lg:text-[11.5px]">
                    {CHAINS[line.chain]?.label} · {line.packLabel} · {formatINR(line.unitPrice)}
                    {line.isPreOrder && " · pre-order"}
                  </span>

                  <div className="mt-1 flex items-center justify-between gap-3 lg:hidden">
                    <div className="flex items-center border border-sop-bone-400">
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.productId, line.quantity - 1)}
                        className="flex h-[38px] w-9 items-center justify-center font-plex text-base leading-none"
                        aria-label="Fewer"
                      >
                        −
                      </button>
                      <span className="w-7 text-center font-plex font-medium text-[13px] leading-none">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.productId, line.quantity + 1)}
                        className="flex h-[38px] w-9 items-center justify-center font-plex text-base leading-none"
                        aria-label="More"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-medium text-sm leading-none text-sop-ink">
                      {formatINR(line.unitPrice * line.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(line.productId)}
                      className="border-b border-sop-bone-400 pb-0.5 font-plex text-[10.5px] leading-none text-sop-ink-50"
                    >
                      Remove
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(line.productId)}
                    className="hidden self-start border-b border-sop-bone-400 pb-0.5 font-plex text-[11px] leading-none text-sop-ink-50 hover:text-sop-ink lg:block"
                  >
                    Remove
                  </button>
                </div>

                <div className="hidden flex-none items-center border border-sop-bone-400 lg:flex">
                  <button
                    type="button"
                    onClick={() => updateQuantity(line.productId, line.quantity - 1)}
                    className="flex h-11 w-10 items-center justify-center font-plex text-[17px] leading-none"
                    aria-label="Fewer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-plex font-medium text-[13.5px] leading-none">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(line.productId, line.quantity + 1)}
                    className="flex h-11 w-10 items-center justify-center font-plex text-[17px] leading-none"
                    aria-label="More"
                  >
                    +
                  </button>
                </div>

                <span className="hidden w-24 flex-none text-right font-medium text-[17px] leading-none text-sop-ink lg:block">
                  {formatINR(line.unitPrice * line.quantity)}
                </span>
              </div>
            ))}
          </div>

          {Object.keys(byChain).length > 1 && (
            <div className="mt-5 border-l-2 border-sop-chill bg-sop-bone-200 p-4">
              <span className="mb-2 block font-archivo font-semibold text-[10px] leading-none tracking-[.14em] uppercase text-sop-ink-50">
                Cold chain at handover
              </span>
              <span className="block font-plex text-[11.5px] leading-[1.6] text-sop-ink-70">
                This order spans {Object.keys(byChain).length} chains, so it arrives in separate
                boxes with separate handling instructions. Insulated, gel packs sized to the slot —
                ask the rider for the probe reading and it goes on your receipt.
              </span>
            </div>
          )}
        </div>

        {/* -------------------------- summary -------------------------- */}
        <div className="bg-sop-bone-200 px-4 pb-10 pt-6 lg:px-8 lg:pb-11 lg:pt-10">
          <span className="sop-eyebrow mb-4 block text-sop-ink-50">Summary</span>

          <div className="mb-4 border-t border-sop-ink">
            {[
              [`Subtotal · ${units} ${units === 1 ? "unit" : "units"}`, formatINR(subtotal)],
              [
                deliveryFee === 0 ? `Delivery · over ${formatINR(RETAIL.freeDeliveryOver)}` : "Delivery",
                deliveryFee === 0 ? "Free" : formatINR(deliveryFee),
              ],
              [isWholesale ? "Invoiced on account" : "Payment", isWholesale ? "Net terms" : "On delivery"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-sop-bone-300 py-2.5">
                <span className="text-[13.5px] leading-[1.4] text-sop-ink-70">{k}</span>
                <span className="font-plex text-[13px] leading-[1.4] text-sop-ink">{v}</span>
              </div>
            ))}
          </div>

          <div className="mb-1.5 flex items-baseline justify-between gap-4">
            <span className="font-archivo font-semibold text-[11px] leading-none tracking-[.14em] uppercase text-sop-ink">
              Total
            </span>
            <span className="font-medium text-[26px] leading-none text-sop-ink lg:text-[34px]">
              {formatINR(subtotal + deliveryFee)}
            </span>
          </div>
          <span className="sop-note mb-5 block">
            Inclusive of taxes · weight settled at packing, billed at the lower figure
          </span>

          {shortfall > 0 && (
            <div className="mb-4 border-l-2 border-sop-rust bg-sop-blush p-3.5 font-plex text-[11.5px] leading-[1.6] text-sop-ink-70">
              {formatINR(shortfall)} short of the{" "}
              {isWholesale ? "wholesale minimum order value" : "minimum cart value"} (
              {formatINR(minimum)}).
            </div>
          )}

          <button
            type="button"
            disabled={shortfall > 0}
            onClick={() => navigate("/checkout")}
            className="sop-btn-ember mb-4 w-full lg:min-h-[56px] lg:text-[12.5px]"
          >
            Continue to delivery
          </button>

          <div className="border-t border-sop-bone-300 pt-4">
            {[
              "Cut the morning of your slot — never pre-portioned to sit.",
              "Probe reading at handover, printed on the receipt.",
              "Weight varies ± 5%. We bill the lower figure, always.",
            ].map((a) => (
              <div key={a} className="flex gap-2.5 py-1.5">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none bg-sop-loin" />
                <span className="font-plex text-xs leading-[1.55] text-sop-ink-70">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
