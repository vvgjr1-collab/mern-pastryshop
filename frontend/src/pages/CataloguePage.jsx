import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { SearchIcon, PackageOpenIcon } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RateLimitedUI from "../components/RateLimitedUI";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import api from "../lib/axios";
import { CATEGORIES, CHAINS, RETAIL, WHOLESALE } from "../lib/trade";
import { getTrack } from "../lib/account";
import { formatINR } from "../lib/utils";

const CataloguePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [track, setTrack] = useState(getTrack());

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const chain = searchParams.get("chain") || "all";
  const search = searchParams.get("search") || "";
  const seasonal = searchParams.get("seasonal") === "true";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products", {
          params: { category, chain, search, seasonal: seasonal || undefined },
        });
        // the API tells us which door it answered — never assume
        setTrack(res.data.track);
        setProducts(res.data.products);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching products");
        console.log(error);
        if (error.response?.status === 429) {
          //429 means rate limited
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load the catalogue");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, chain, search, seasonal]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all" || value === "false") next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  const isWholesale = track === "wholesale";

  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {/* which door am I standing at, and what are its rules */}
        <div
          className={`rounded-lg border p-4 mb-6 ${
            isWholesale
              ? "border-primary/40 bg-primary/10"
              : "border-base-content/10 bg-base-100"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">
                {isWholesale ? "Wholesale rate card" : "Catalogue"}
              </h1>
              <p className="text-sm text-base-content/70">
                {isWholesale
                  ? `Case pricing, MOQ per SKU. Minimum order ${formatINR(
                      WHOLESALE.minOrderValue
                    )} · cut-off ${WHOLESALE.orderCutOff}`
                  : `Retail packs, prices inclusive. Minimum cart ${formatINR(
                      RETAIL.minCartValue
                    )} · free delivery over ${formatINR(
                      RETAIL.freeDeliveryOver
                    )}`}
              </p>
            </div>
            {!isWholesale && (
              <Link to="/wholesale" className="btn btn-outline btn-sm">
                Buying for a kitchen? Open a trade account
              </Link>
            )}
          </div>
        </div>

        {/* filters */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <label className="input input-bordered flex items-center gap-2 flex-1">
            <SearchIcon className="size-4 opacity-60" />
            <input
              type="text"
              className="grow"
              placeholder="Search a cut, a SKU, or 'belly'"
              value={search}
              onChange={(e) => setParam("search", e.target.value)}
            />
          </label>

          <select
            className="select select-bordered"
            value={category}
            onChange={(e) => setParam("category", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered"
            value={chain}
            onChange={(e) => setParam("chain", e.target.value)}
          >
            <option value="all">Any chain</option>
            {Object.entries(CHAINS).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label} · {meta.temp}
              </option>
            ))}
          </select>

          <label className="label cursor-pointer gap-2 border border-base-content/10 rounded-lg px-4">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={seasonal}
              onChange={(e) => setParam("seasonal", String(e.target.checked))}
            />
            <span className="label-text whitespace-nowrap">Seasonal only</span>
          </label>
        </div>

        {loading && (
          <div className="text-center text-primary py-10">
            Loading the catalogue...
          </div>
        )}

        {!loading && products.length === 0 && !isRateLimited && (
          <EmptyState
            icon={PackageOpenIcon}
            title="Nothing matches that"
            message="Try a wider filter, or search by the cut rather than the dish."
          />
        )}

        {products.length > 0 && !isRateLimited && (
          <>
            <p className="text-sm text-base-content/50 mb-3">
              {products.length} SKU{products.length === 1 ? "" : "s"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} track={track} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CataloguePage;
