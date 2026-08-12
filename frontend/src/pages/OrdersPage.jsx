import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router";
import { PackageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EmptyState from "../components/EmptyState";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import { getUserId } from "../lib/userId";
import { formatDate, formatINR } from "../lib/utils";

const statusStyles = {
  pending: "badge-warning",
  confirmed: "badge-info",
  packed: "badge-info",
  dispatched: "badge-primary",
  delivered: "badge-success",
  cancelled: "badge-error",
};

const OrdersPage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = getUserId();
        const res = await api.get("/orders", {
          params: { userId },
        });
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
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-5xl mx-auto p-4 mt-6">
        <h1 className="text-3xl font-bold mb-6">Your orders</h1>

        {loading && (
          <div className="text-center text-primary py-10">Loading orders...</div>
        )}

        {!loading && orders.length === 0 && !isRateLimited && (
          <EmptyState
            icon={PackageIcon}
            title="No orders yet"
            message="Your delivery history, standing orders and pre-orders will live here."
            actionLabel="Browse the catalogue"
            actionTo="/catalogue"
          />
        )}

        {orders.length > 0 && !isRateLimited && (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/order/${order._id}`}
                className="card bg-base-100 hover:shadow-lg transition-all duration-200
                border-l-4 border-solid border-primary"
              >
                <div className="card-body">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="card-title font-mono text-base">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-base-content/60">
                        {formatDate(new Date(order.createdAt))} ·{" "}
                        {order.items.length} line
                        {order.items.length === 1 ? "" : "s"} ·{" "}
                        {order.deliverySlot}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="badge badge-outline">
                        {order.track === "wholesale" ? "Wholesale" : "Home"}
                      </span>
                      {order.isStandingOrder && (
                        <span className="badge badge-ghost">Standing</span>
                      )}
                      <span
                        className={`badge ${statusStyles[order.status] || ""}`}
                      >
                        {order.status}
                      </span>
                      <span className="font-bold text-primary">
                        {formatINR(order.total)}
                      </span>
                    </div>
                  </div>
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
