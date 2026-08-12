import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeftIcon,
  LoaderIcon,
  RefreshCwIcon,
  XCircleIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChainBadge from "../components/ChainBadge";
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
    if (!window.confirm("Cancel this order? Stock goes back to the cold room."))
      return;

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
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="max-w-2xl mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold">Order not found</h2>
          <Link to="/orders" className="btn btn-primary mt-4">
            Back to your orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = steps.indexOf(order.status);
  const chains = [...new Set(order.items.map((line) => line.chain))];

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/orders" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to orders
            </Link>

            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm" onClick={handleReorder}>
                <RefreshCwIcon className="size-4" />
                Reorder
              </button>
              {!["dispatched", "delivered", "cancelled"].includes(
                order.status
              ) && (
                <button
                  className="btn btn-error btn-outline btn-sm"
                  onClick={handleCancel}
                >
                  <XCircleIcon className="size-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="card bg-base-100 mb-6">
            <div className="card-body">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold font-mono">
                    {order.orderNumber}
                  </h1>
                  <p className="text-sm text-base-content/60">
                    Placed {formatDate(new Date(order.createdAt))}
                  </p>
                </div>
                <div className="text-right">
                  <span className="badge badge-outline">
                    {order.track === "wholesale" ? "Wholesale" : "Home"}
                  </span>
                  <p className="text-2xl font-bold text-primary mt-2">
                    {formatINR(order.total)}
                  </p>
                </div>
              </div>

              {order.status === "cancelled" ? (
                <div className="alert alert-error mt-4">
                  <span>This order was cancelled.</span>
                </div>
              ) : (
                <ul className="steps w-full mt-6">
                  {steps.map((step, index) => (
                    <li
                      key={step}
                      className={`step ${
                        index <= currentStep ? "step-primary" : ""
                      }`}
                    >
                      {step}
                    </li>
                  ))}
                </ul>
              )}

              <div className="grid gap-4 sm:grid-cols-2 mt-6 text-sm">
                <div>
                  <p className="text-base-content/50">Delivering to</p>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-base-content/70">{order.customer.phone}</p>
                  <p className="text-base-content/70">{order.customer.address}</p>
                  <p className="text-base-content/70">
                    {order.customer.city} {order.customer.pincode}
                  </p>
                </div>
                <div>
                  <p className="text-base-content/50">
                    {order.track === "wholesale"
                      ? "Delivery window"
                      : "Delivery slot"}
                  </p>
                  <p className="font-medium">{order.deliverySlot}</p>
                  {order.isStandingOrder && (
                    <p className="text-base-content/70">
                      Repeating as a standing order
                    </p>
                  )}
                  {order.track === "wholesale" && (
                    <>
                      <p className="text-base-content/50 mt-3">Account</p>
                      <p className="font-medium">{order.business.legalName}</p>
                      <p className="text-base-content/70">
                        GSTIN {order.business.gstin} · FSSAI{" "}
                        {order.business.fssai}
                      </p>
                      <p className="text-base-content/70">
                        {order.business.paymentTerms}
                      </p>
                      {order.business.poReference && (
                        <p className="text-base-content/70">
                          PO {order.business.poReference}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {order.notes && (
                <p className="text-sm text-base-content/70 mt-4">
                  <span className="text-base-content/50">Notes: </span>
                  {order.notes}
                </p>
              )}
            </div>
          </div>

          {/* ------------------------- the lines ------------------------- */}
          <div className="card bg-base-100 mb-6">
            <div className="card-body">
              <h2 className="card-title">Lines</h2>
              <div className="divide-y divide-base-content/10">
                {order.items.map((line) => (
                  <div
                    key={line.sku}
                    className="py-3 flex flex-wrap items-center justify-between gap-2"
                  >
                    <div>
                      <p className="font-medium">{line.name}</p>
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
                    </div>
                    <div className="text-right text-sm">
                      <p>
                        {line.quantity} × {line.packLabel}
                      </p>
                      <p className="text-base-content/60">
                        {formatINR(line.unitPrice)} each ·{" "}
                        <strong className="text-base-content">
                          {formatINR(line.lineTotal)}
                        </strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right text-sm mt-4 space-y-1">
                <p>Subtotal {formatINR(order.subtotal)}</p>
                <p>
                  Delivery{" "}
                  {order.deliveryFee === 0
                    ? "Included"
                    : formatINR(order.deliveryFee)}
                </p>
                <p className="text-lg font-bold text-primary">
                  Total {formatINR(order.total)}
                </p>
              </div>
            </div>
          </div>

          {/* ------------------ handling on arrival ------------------ */}
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title">When the box lands</h2>
              <p className="text-sm text-base-content/60">
                This order travels in {chains.length} chain
                {chains.length === 1 ? "" : "s"}. Each arrives separately.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 mt-2">
                {chains.map((chain) => (
                  <div
                    key={chain}
                    className="border border-base-content/10 rounded-lg p-3"
                  >
                    <ChainBadge chain={chain} showTemp />
                    <p className="text-sm text-base-content/70 mt-2">
                      {CHAINS[chain]?.onArrival}
                    </p>
                    <p className="text-xs text-base-content/50 mt-1">
                      {CHAINS[chain]?.risk}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetailPage;
