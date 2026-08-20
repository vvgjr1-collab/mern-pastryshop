import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../lib/axios";
import { getCart, clearCart } from "../lib/cart";
import { getUserId } from "../lib/userId";
import { getStoredAccount, hasWholesaleAccess } from "../lib/account";
import { formatINR } from "../lib/utils";
import { RETAIL, WHOLESALE } from "../lib/trade";

const CheckoutPage = () => {
  const [cart, setCart] = useState(getCart());
  const [loading, setLoading] = useState(false);

  const account = getStoredAccount();
  const isWholesale = cart.track === "wholesale";
  // A wholesale basket priced in cases must not be submitted from the consumer
  // door — the server would re-price it as retail packs.
  const trackMismatch = isWholesale && !hasWholesaleAccess();
  // Demo lines have no row in the catalogue, so the server rejects the order
  // with "product no longer available". Say so up front rather than failing at
  // the last click.
  const hasDemoLines = cart.lines.some((line) =>
    String(line.productId).startsWith("demo-")
  );

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    deliverySlot: "",
    poReference: "",
    isStandingOrder: false,
    notes: "",
  });

  const navigate = useNavigate();

  // prefill from the trade account — a buyer shouldn't retype their own address
  useEffect(() => {
    if (isWholesale && account) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || account.contactName || "",
        phone: prev.phone || account.phone || "",
        email: prev.email || account.email || "",
        address: prev.address || account.deliveryAddress || "",
        city: prev.city || account.city || "",
      }));
    }
  }, [isWholesale, account?.accountKey]);

  useEffect(() => {
    const sync = () => setCart(getCart());
    window.addEventListener("cart:updated", sync);
    return () => window.removeEventListener("cart:updated", sync);
  }, []);

  const subtotal = cart.lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const deliveryFee =
    isWholesale || subtotal >= RETAIL.freeDeliveryOver ? 0 : RETAIL.deliveryFee;
  const slots = isWholesale ? WHOLESALE.windows : RETAIL.slots;

  const set = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.lines.length === 0) {
      toast.error("Your order is empty");
      return;
    }
    if (trackMismatch) {
      toast.error("Sign back in to your trade account to place a case order");
      return;
    }
    if (hasDemoLines) {
      toast.error("Demo lines can't be ordered — these SKUs aren't in the catalogue yet");
      return;
    }
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Name, phone and address are required");
      return;
    }
    if (!form.deliverySlot) {
      toast.error(isWholesale ? "Pick a delivery window" : "Pick a delivery slot");
      return;
    }

    setLoading(true);
    try {
      const userId = getUserId();
      // only ids and quantities go up — the server prices the order
      const res = await api.post("/orders", {
        userId,
        items: cart.lines.map((line) => ({
          productId: line.productId,
          sku: line.sku, // lets the server resolve a demo line by SKU
          quantity: line.quantity,
        })),
        customer: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
          pincode: form.pincode,
        },
        deliverySlot: form.deliverySlot,
        poReference: form.poReference,
        isStandingOrder: form.isStandingOrder,
        notes: form.notes,
      });

      clearCart();
      toast.success(`Order ${res.data.orderNumber} placed`);
      navigate(`/order/${res.data._id}`);
    } catch (error) {
      console.log("Error placing order", error);
      if (error.response?.status === 429) {
        toast.error("Slow down — too many requests in a row", { duration: 4000 });
      } else {
        toast.error(error.response?.data?.message || "Failed to place the order");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sop-bone-100">
      <Navbar />

      <div className="grid lg:grid-cols-[1fr_430px]">
        {/* --------------------------- form ---------------------------- */}
        <div className="border-b border-sop-bone-300 px-4 pb-8 pt-6 lg:border-b-0 lg:border-r lg:px-10 lg:pb-12 lg:pt-10">
          <Link
            to="/cart"
            className="mb-5 inline-block font-plex text-[13px] leading-none text-sop-ink-50 hover:text-sop-ink"
          >
            ← Back to the order
          </Link>

          <h1 className="font-display text-[38px] leading-[.98] text-sop-ink lg:text-[52px] lg:leading-[.96]">
            {isWholesale ? "Place wholesale order" : "Delivery"}
          </h1>
          <span className="mb-6 mt-1 block font-plex text-[11.5px] leading-[1.5] text-sop-ink-50 lg:text-xs">
            Chilled lines are cut the morning of the slot. Frozen lines travel gel-packed.
          </span>

          {hasDemoLines && (
            <div className="mb-5 border-l-2 border-sop-rust bg-sop-blush p-4">
              <span className="mb-1.5 block font-archivo font-semibold text-[10px] leading-none tracking-[.14em] uppercase text-sop-rust">
                Demo basket
              </span>
              <span className="block font-plex text-[11.5px] leading-[1.6] text-sop-ink-70">
                These are sample SKUs from the demo counter, so there is nothing to pick, weigh or
                invoice against. Orders open once the live catalogue is loaded.
              </span>
            </div>
          )}

          {trackMismatch && (
            <div className="mb-5 border-l-2 border-sop-rust bg-sop-blush p-4 font-plex text-[11.5px] leading-[1.6] text-sop-ink-70">
              This basket is priced in cases, but your trade account isn't active in this browser.{" "}
              <Link to="/wholesale" className="border-b border-sop-ember text-sop-ink">
                Sign back in
              </Link>{" "}
              to place it.
            </div>
          )}

          {isWholesale && account && (
            <div className="mb-5 bg-sop-bone-200 p-4 font-plex text-[11.5px] leading-[1.6] text-sop-ink-70">
              Billing to <strong className="text-sop-ink">{account.businessName}</strong> · GSTIN{" "}
              {account.gstin} · FSSAI {account.fssai} · {account.creditTerms}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="sop-label">Contact name *</span>
                <input type="text" className="sop-input" value={form.name} onChange={set("name")} />
              </label>

              <label className="flex flex-col gap-2">
                <span className="sop-label">Phone *</span>
                <input type="tel" className="sop-input" value={form.phone} onChange={set("phone")} />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="sop-label">Email</span>
                <input
                  type="email"
                  className="sop-input"
                  value={form.email}
                  onChange={set("email")}
                />
              </label>

              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="sop-label">Delivery address *</span>
                <textarea
                  className="sop-textarea h-24"
                  placeholder="Kitchen entrance, not the front desk"
                  value={form.address}
                  onChange={set("address")}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="sop-label">City</span>
                <input type="text" className="sop-input" value={form.city} onChange={set("city")} />
              </label>

              <label className="flex flex-col gap-2">
                <span className="sop-label">Pincode</span>
                <input
                  type="text"
                  className="sop-input"
                  value={form.pincode}
                  onChange={set("pincode")}
                />
              </label>
            </div>

            {/* the slot is part of the product */}
            <div className="mt-7">
              <span className="sop-label mb-3">
                {isWholesale ? "Delivery window *" : "Pick a slot *"}
              </span>
              <div className="flex flex-col gap-2">
                {slots.map((slot) => {
                  const on = form.deliverySlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, deliverySlot: slot }))}
                      className={`flex items-center justify-between gap-3 border-[1.5px] p-3.5 text-left ${
                        on
                          ? "border-sop-ink bg-sop-blush"
                          : "border-sop-bone-300 bg-sop-bone-100 hover:border-sop-ink"
                      }`}
                    >
                      <span className="font-medium text-[13.5px] leading-none text-sop-ink lg:text-sm">
                        {slot}
                      </span>
                      <span
                        className={`font-plex text-[11px] leading-none ${
                          on ? "text-sop-rust" : "text-sop-ink-50"
                        }`}
                      >
                        {on ? "selected" : "open"}
                      </span>
                    </button>
                  );
                })}
              </div>
              {isWholesale && (
                <span className="sop-note mt-3 block">Order cut-off: {WHOLESALE.orderCutOff}</span>
              )}
            </div>

            {isWholesale && (
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="sop-label">PO reference</span>
                  <input
                    type="text"
                    className="sop-input"
                    value={form.poReference}
                    onChange={set("poReference")}
                  />
                </label>

                <label className="flex cursor-pointer items-start gap-2.5 border border-sop-bone-300 p-3.5 sm:mt-7">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-3.5 w-3.5 accent-sop-ink"
                    checked={form.isStandingOrder}
                    onChange={set("isStandingOrder")}
                  />
                  <span className="flex flex-col gap-1.5">
                    <span className="font-medium text-[12.5px] leading-[1.3] text-sop-ink">
                      Repeat this as a standing order
                    </span>
                    <span className="font-plex text-[11px] leading-[1.5] text-sop-ink-50">
                      Same lines, same window, every week until you stop it.
                    </span>
                  </span>
                </label>
              </div>
            )}

            <label className="mt-7 flex flex-col gap-2">
              <span className="sop-label">Notes for the cold room</span>
              <textarea
                className="sop-textarea h-20"
                placeholder="Cut instructions, gate access, who receives the box"
                value={form.notes}
                onChange={set("notes")}
              />
            </label>

            <div className="mt-7 flex items-center justify-between gap-5 bg-sop-ink p-5">
              <div className="flex flex-col gap-1.5">
                <span className="font-archivo font-semibold text-[10.5px] leading-none tracking-[.16em] uppercase text-sop-loin">
                  Rather order by message?
                </span>
                <span className="font-plex text-[11.5px] leading-[1.6] text-sop-ash">
                  Send the order to the counter on WhatsApp — same prices, same slots, a person on
                  the other end.
                </span>
              </div>
              <span className="hidden whitespace-nowrap font-plex text-[11.5px] leading-none text-sop-bone-100 sm:block">
                +91 98860 41207
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || trackMismatch || hasDemoLines}
              className="sop-btn-ember mt-4 w-full lg:hidden"
            >
              {loading ? "Placing order…" : `Place order · ${formatINR(subtotal + deliveryFee)}`}
            </button>
          </form>
        </div>

        {/* -------------------------- summary -------------------------- */}
        <div className="bg-sop-bone-200 px-4 pb-10 pt-6 lg:px-8 lg:pb-11 lg:pt-10">
          <span className="sop-eyebrow mb-4 block text-sop-ink-50">Summary</span>

          <div className="mb-4 border-t border-sop-ink">
            {cart.lines.map((line) => (
              <div key={line.productId} className="border-b border-sop-bone-300 py-2.5">
                <div className="flex justify-between gap-3">
                  <span className="text-[13.5px] leading-[1.4] text-sop-ink">
                    {line.quantity} × {line.name}
                  </span>
                  <span className="whitespace-nowrap font-plex text-[13px] leading-[1.4] text-sop-ink">
                    {formatINR(line.unitPrice * line.quantity)}
                  </span>
                </div>
                <span className="mt-1 block font-plex text-[10.5px] leading-none text-sop-ink-50">
                  {line.packLabel}
                  {line.isPreOrder && " · pre-order"}
                </span>
              </div>
            ))}
          </div>

          <div className="mb-4 flex justify-between gap-4 border-b border-sop-bone-300 pb-2.5">
            <span className="text-[13.5px] leading-[1.4] text-sop-ink-70">Delivery</span>
            <span className="font-plex text-[13px] leading-[1.4] text-sop-ink">
              {deliveryFee === 0 ? "Included" : formatINR(deliveryFee)}
            </span>
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
            {isWholesale
              ? "Invoiced against your account terms. No card is taken here."
              : "Inclusive of taxes · payment collected on delivery."}
          </span>

          <button
            type="button"
            disabled={loading || trackMismatch || hasDemoLines}
            onClick={handleSubmit}
            className="sop-btn-ember hidden w-full lg:inline-flex lg:min-h-[56px] lg:text-[12.5px]"
          >
            {loading ? "Placing order…" : `Place order · ${formatINR(subtotal + deliveryFee)}`}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
