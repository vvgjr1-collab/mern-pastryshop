import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
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

  const subtotal = cart.lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0
  );
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
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Name, phone and address are required");
      return;
    }
    if (!form.deliverySlot) {
      toast.error(
        isWholesale ? "Pick a delivery window" : "Pick a delivery slot"
      );
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
        toast.error("Slow down — too many requests in a row", {
          duration: 4000,
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to place the order");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/cart" className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to the basket
          </Link>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 card bg-base-100">
              <div className="card-body">
                <h1 className="card-title text-2xl mb-2">
                  {isWholesale ? "Place wholesale order" : "Checkout"}
                </h1>

                {trackMismatch && (
                  <div className="alert alert-warning mb-4 text-sm">
                    <span>
                      This basket is priced in cases, but your trade account
                      isn't active in this browser.{" "}
                      <Link to="/wholesale" className="link">
                        Sign back in
                      </Link>{" "}
                      to place it.
                    </span>
                  </div>
                )}

                {isWholesale && account && (
                  <div className="alert mb-4 text-sm">
                    <span>
                      Billing to <strong>{account.businessName}</strong> · GSTIN{" "}
                      {account.gstin} · FSSAI {account.fssai} ·{" "}
                      {account.creditTerms}
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Contact name *</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={form.name}
                        onChange={set("name")}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Phone *</span>
                      </label>
                      <input
                        type="tel"
                        className="input input-bordered"
                        value={form.phone}
                        onChange={set("phone")}
                      />
                    </div>

                    <div className="form-control sm:col-span-2">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        className="input input-bordered"
                        value={form.email}
                        onChange={set("email")}
                      />
                    </div>

                    <div className="form-control sm:col-span-2">
                      <label className="label">
                        <span className="label-text">Delivery address *</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered h-24"
                        value={form.address}
                        onChange={set("address")}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">City</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={form.city}
                        onChange={set("city")}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Pincode</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={form.pincode}
                        onChange={set("pincode")}
                      />
                    </div>

                    <div className="form-control sm:col-span-2">
                      <label className="label">
                        <span className="label-text">
                          {isWholesale ? "Delivery window *" : "Delivery slot *"}
                        </span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={form.deliverySlot}
                        onChange={set("deliverySlot")}
                      >
                        <option value="">
                          {isWholesale
                            ? "Choose a window"
                            : "Choose a delivery slot"}
                        </option>
                        {slots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      {isWholesale && (
                        <span className="label-text-alt mt-2 text-base-content/60">
                          Order cut-off: {WHOLESALE.orderCutOff}
                        </span>
                      )}
                    </div>

                    {isWholesale && (
                      <>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">PO reference</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={form.poReference}
                            onChange={set("poReference")}
                          />
                        </div>

                        <div className="form-control justify-end">
                          <label className="label cursor-pointer gap-3">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-primary"
                              checked={form.isStandingOrder}
                              onChange={set("isStandingOrder")}
                            />
                            <span className="label-text">
                              Repeat this as a standing order
                            </span>
                          </label>
                        </div>
                      </>
                    )}

                    <div className="form-control sm:col-span-2">
                      <label className="label">
                        <span className="label-text">Notes for the cold room</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered h-20"
                        placeholder="Cut instructions, gate access, who receives the box"
                        value={form.notes}
                        onChange={set("notes")}
                      />
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-6">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading || trackMismatch}
                    >
                      {loading ? "Placing order..." : "Place order"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* ------------------------ summary ------------------------ */}
            <div className="card bg-base-100 h-fit">
              <div className="card-body">
                <h2 className="card-title text-lg">Order summary</h2>
                <ul className="text-sm divide-y divide-base-content/10">
                  {cart.lines.map((line) => (
                    <li key={line.productId} className="py-2">
                      <div className="flex justify-between gap-2">
                        <span>
                          {line.quantity} × {line.name}
                        </span>
                        <span className="whitespace-nowrap">
                          {formatINR(line.unitPrice * line.quantity)}
                        </span>
                      </div>
                      <span className="text-xs text-base-content/50">
                        {line.packLabel}
                        {line.isPreOrder && " · pre-order"}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Delivery</span>
                    <span>
                      {deliveryFee === 0 ? "Included" : formatINR(deliveryFee)}
                    </span>
                  </p>
                  <p className="flex justify-between text-lg font-bold text-primary pt-2">
                    <span>Total</span>
                    <span>{formatINR(subtotal + deliveryFee)}</span>
                  </p>
                </div>

                <p className="text-xs text-base-content/50 mt-3">
                  {isWholesale
                    ? "Invoiced against your account terms. No card is taken here."
                    : "Payment is collected on delivery."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
