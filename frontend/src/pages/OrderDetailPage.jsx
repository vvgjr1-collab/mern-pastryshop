import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../lib/axios";
import { formatDate, formatINR } from "../lib/utils";
import { addToCart } from "../lib/cart";
import { CHAINS } from "../lib/trade";

const steps = ["pending", "confirmed", "packed", "dispatched", "delivered"];

const OrderDetailPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.log("Error in fetching order", error);
        toast.error("Failed to fetch the order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order? Stock goes back to the cold room.")) return;

    try {
      const res = await api.delete(`/orders/${id}`);
      setOrder(res.data.order || { ...order, status: "cancelled" });
      toast.success("Order cancelled");
    } catch (error) {
      console.log("Error cancelling the order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel the order");
    }
  };

  // Repeat order — the wholesale standing-order shortcut, and handy for retail.
  const handleReorder = () => {
    order.items.forEach((line) =>
      addToCart(
        {
          productId: line.product,
          sku: line.sku,
          name: line.name,
          image: "🥩",
          chain: line.chain,
          packLabel: line.packLabel,
          unitPrice: line.unitPrice,
          quantity: line.quantity,
          minQty: 1,
          isPreOrder: line.isPreOrder,
        },
        order.track
      )
    );
    toast.success("Lines copied into a new order");
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sop-bone-100">
        <Navbar />
        <div className="px-4 py-20 text-center font-plex text-xs text-sop-ink-50">
          loading the order…
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-sop-bone-100">
        <Navbar />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h2 className="mb-4 font-display text-[30px] leading-none text-sop-ink">
            Order not found
          </h2>
          <Link to="/orders" className="sop-btn-outline">
            Back to your orders
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStep = steps.indexOf(order.status);
  const chains = [...new Set(order.items.map((l) => l.chain))];
  const cancelled = order.status === "cancelled";

  return (
    <div className="min-h-screen bg-sop-bone-100">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 lg:px-8 lg:pt-10">
        <Link
          to="/orders"
          className="mb-5 inline-block font-plex text-[13px] leading-none text-sop-ink-50 hover:text-sop-ink"
        >
          ← Back to orders
        </Link>

        {/* ------------------------ order head ------------------------- */}
        <div className="mb-7 bg-sop-loin px-4 py-6 lg:px-7 lg:py-8">
          <span className="sop-eyebrow mb-3 block text-sop-rust">
            {cancelled ? "Order cancelled" : "Order placed"}
          </span>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[36px] leading-[.95] text-sop-ink lg:text-[46px]">
                {order.orderNumber}
              </h1>
              <span className="mt-2 block font-plex text-[11.5px] leading-[1.6] text-sop-rust">
                {formatDate(new Date(order.createdAt))} · {order.deliverySlot}
                {order.isStandingOrder && " · standing order"}
              </span>
            </div>
            <span className="font-medium text-[28px] leading-none text-sop-ink lg:text-[34px]">
              {formatINR(order.total)}
            </span>
          </div>
        </div>

        {/* progress */}
        {!cancelled && (
          <div className="mb-7 grid grid-cols-5 gap-px bg-sop-bone-300">
            {steps.map((step, i) => (
              <div
                key={step}
                className={`px-2 py-3 text-center font-archivo font-semibold text-[9.5px] leading-none tracking-[.1em] uppercase lg:text-[10.5px] ${
                  i <= currentStep
                    ? "bg-sop-ink text-sop-bone-100"
                    : "bg-sop-bone-100 text-sop-ink-40"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        )}

        <div className="mb-7 flex flex-wrap gap-3">
          <button type="button" onClick={handleReorder} className="sop-btn-outline">
            Reorder these lines
          </button>
          {!["dispatched", "delivered", "cancelled"].includes(order.status) && (
            <button
              type="button"
              onClick={handleCancel}
              className="sop-btn min-h-[48px] border-[1.5px] border-sop-cured text-sop-cured hover:bg-sop-cured hover:text-sop-bone-100"
            >
              Cancel order
            </button>
          )}
        </div>

        {/* ------------------------- the lines -------------------------- */}
        <h2 className="mb-1 font-display text-[26px] leading-[1.05] text-sop-ink lg:text-[32px]">
          Lines
        </h2>
        <span className="sop-note mb-3 block">
          Prices are the ones agreed at order time — a later rate change never rewrites history.
        </span>
        <div className="mb-8 border-t border-sop-ink">
          {order.items.map((line) => (
            <div
              key={line.sku}
              className="flex flex-wrap items-baseline justify-between gap-3 border-b border-sop-bone-300 py-3.5"
            >
              <div>
                <span className="block font-medium text-[14px] leading-[1.3] text-sop-ink">
                  {line.name}
                </span>
                <span className="mt-1.5 block font-plex text-[10.5px] leading-none text-sop-ink-50">
                  {line.sku} · {CHAINS[line.chain]?.label}
                  {line.isPreOrder && " · pre-order"}
                </span>
              </div>
              <div className="text-right">
                <span className="block font-plex text-[12.5px] leading-none text-sop-ink">
                  {line.quantity} × {line.packLabel}
                </span>
                <span className="mt-1.5 block font-plex text-[10.5px] leading-none text-sop-ink-50">
                  {formatINR(line.unitPrice)} each ·{" "}
                  <strong className="font-medium text-sop-ink">{formatINR(line.lineTotal)}</strong>
                </span>
              </div>
            </div>
          ))}

          <div className="flex justify-between gap-4 border-b border-sop-bone-300 py-2.5">
            <span className="sop-key">Subtotal</span>
            <span className="sop-val">{formatINR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-sop-bone-300 py-2.5">
            <span className="sop-key">Delivery</span>
            <span className="sop-val">
              {order.deliveryFee === 0 ? "Included" : formatINR(order.deliveryFee)}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3">
            <span className="font-archivo font-semibold text-[11px] leading-none tracking-[.14em] uppercase text-sop-ink">
              Total
            </span>
            <span className="font-medium text-[22px] leading-none text-sop-ink">
              {formatINR(order.total)}
            </span>
          </div>
        </div>

        {/* ---------------------- delivery + account -------------------- */}
        <div className="mb-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 font-display text-[24px] leading-none text-sop-ink lg:text-[28px]">
              Delivering to
            </h2>
            <div className="border-t border-sop-ink">
              <div className="sop-row">
                <span className="sop-key">Name</span>
                <span className="sop-val">{order.customer.name}</span>
              </div>
              <div className="sop-row">
                <span className="sop-key">Phone</span>
                <span className="sop-val">{order.customer.phone}</span>
              </div>
              <div className="sop-row">
                <span className="sop-key">Address</span>
                <span className="sop-val">
                  {order.customer.address}
                  {order.customer.city && `, ${order.customer.city}`} {order.customer.pincode}
                </span>
              </div>
              <div className="sop-row">
                <span className="sop-key">
                  {order.track === "wholesale" ? "Window" : "Slot"}
                </span>
                <span className="sop-val">{order.deliverySlot}</span>
              </div>
              {order.notes && (
                <div className="sop-row">
                  <span className="sop-key">Notes</span>
                  <span className="sop-val">{order.notes}</span>
                </div>
              )}
            </div>
          </div>

          {order.track === "wholesale" && (
            <div>
              <h2 className="mb-3 font-display text-[24px] leading-none text-sop-ink lg:text-[28px]">
                Account
              </h2>
              <div className="border-t border-sop-ink">
                <div className="sop-row">
                  <span className="sop-key">Billed to</span>
                  <span className="sop-val">{order.business.legalName}</span>
                </div>
                <div className="sop-row">
                  <span className="sop-key">GSTIN</span>
                  <span className="sop-val">{order.business.gstin}</span>
                </div>
                <div className="sop-row">
                  <span className="sop-key">FSSAI</span>
                  <span className="sop-val">{order.business.fssai}</span>
                </div>
                <div className="sop-row">
                  <span className="sop-key">Terms</span>
                  <span className="sop-val">{order.business.paymentTerms}</span>
                </div>
                {order.business.poReference && (
                  <div className="sop-row">
                    <span className="sop-key">PO</span>
                    <span className="sop-val">{order.business.poReference}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* -------------------- when the box lands ---------------------- */}
        <div className="bg-sop-ink px-4 py-6 lg:px-7 lg:py-8">
          <span className="sop-eyebrow mb-3 block text-sop-chill">When the box lands</span>
          <h2 className="mb-4 font-display text-[26px] leading-none text-sop-bone-100 lg:text-[32px]">
            {chains.length} chain{chains.length === 1 ? "" : "s"}, arriving separately
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {chains.map((chain) => (
              <div key={chain} className="border border-sop-ink-70 p-4">
                <span className="mb-2 block font-archivo font-semibold text-[10px] leading-none tracking-[.14em] uppercase text-sop-loin">
                  {CHAINS[chain]?.label} · {CHAINS[chain]?.temp}
                </span>
                <span className="mb-2 block font-plex text-[11.5px] leading-[1.6] text-sop-bone-100">
                  {CHAINS[chain]?.onArrival}
                </span>
                <span className="block font-plex text-[11px] leading-[1.6] text-sop-ink-40">
                  {CHAINS[chain]?.risk}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetailPage;
