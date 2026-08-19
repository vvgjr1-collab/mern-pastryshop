import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EmptyState from "../components/EmptyState";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import { getUserId } from "../lib/userId";
import { formatDate, formatINR } from "../lib/utils";

const statusTone = {
  pending: "bg-sop-blush text-sop-rust",
  confirmed: "bg-sop-bone-200 text-sop-ink",
  packed: "bg-sop-bone-200 text-sop-ink",
  dispatched: "bg-sop-loin text-sop-ink",
  delivered: "bg-sop-ink text-sop-bone-100",
  cancelled: "bg-sop-cured text-sop-bone-100",
};

const OrdersPage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = getUserId();
        const res = await api.get("/orders", { params: { userId } });
        setOrders(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching orders");
        console.log(error);
        if (error.response?.status === 429) {
          //429 means rate limited
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load your orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-sop-bone-100">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}

      <div className="mx-auto max-w-5xl px-4 pb-12 pt-7 lg:px-8 lg:pt-11">
        <h1 className="mb-1.5 font-display text-[38px] leading-[.98] text-sop-ink lg:text-[52px]">
          Your orders
        </h1>
        <span className="mb-6 block font-plex text-[11.5px] leading-[1.5] text-sop-ink-50 lg:mb-8 lg:text-xs">
          Delivery history, standing orders and pre-orders, newest first.
        </span>

        {loading && (
          <div className="py-12 text-center font-plex text-xs text-sop-ink-50">
            loading your orders…
          </div>
        )}

        {!loading && orders.length === 0 && !isRateLimited && (
          <EmptyState
            title="No orders yet"
            message="Your delivery history, standing orders and pre-orders will live here."
            actionLabel="Shop the counter"
            actionTo="/catalogue"
          />
        )}

        {orders.length > 0 && !isRateLimited && (
          <div className="border-t border-sop-ink">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/order/${order._id}`}
                className="flex flex-col gap-3 border-b border-sop-bone-300 py-4 transition-colors duration-[120ms] hover:bg-sop-blush sm:flex-row sm:items-center sm:justify-between lg:py-5"
              >
                <div>
                  <span className="block font-plex font-medium text-[13px] leading-none text-sop-ink lg:text-sm">
                    {order.orderNumber}
                  </span>
                  <span className="mt-2 block font-plex text-[11px] leading-[1.5] text-sop-ink-50">
                    {formatDate(new Date(order.createdAt))} · {order.items.length} line
                    {order.items.length === 1 ? "" : "s"} · {order.deliverySlot}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="border border-sop-bone-300 px-2 py-1.5 font-plex text-[9.5px] leading-none tracking-[.08em] uppercase text-sop-ink-50">
                    {order.track === "wholesale" ? "Wholesale" : "Home"}
                  </span>
                  {order.isStandingOrder && (
                    <span className="border border-sop-bone-300 px-2 py-1.5 font-plex text-[9.5px] leading-none tracking-[.08em] uppercase text-sop-ink-50">
                      Standing
                    </span>
                  )}
                  <span
                    className={`px-2 py-1.5 font-archivo font-semibold text-[9.5px] leading-none tracking-[.1em] uppercase ${
                      statusTone[order.status] || "bg-sop-bone-200 text-sop-ink"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="ml-1 font-medium text-[16px] leading-none text-sop-ink">
                    {formatINR(order.total)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrdersPage;
