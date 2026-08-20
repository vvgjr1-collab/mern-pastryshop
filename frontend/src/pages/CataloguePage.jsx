import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RateLimitedUI from "../components/RateLimitedUI";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import Hatch from "../components/Hatch";
import api from "../lib/axios";
import { CATEGORIES, CHAINS, RETAIL, WHOLESALE } from "../lib/trade";
import { getTrack } from "../lib/account";
import { formatINR } from "../lib/utils";
import { filterDemoProducts } from "../lib/demoProducts";

// The counter, by family. Counts come off the loaded catalogue so the rail
// never claims stock we don't carry.
const CataloguePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isDemoCatalogue, setIsDemoCatalogue] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [track, setTrack] = useState(getTrack());

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const chain = searchParams.get("chain") || "all";
  const search = searchParams.get("search") || "";
  const seasonal = searchParams.get("seasonal") === "true";
  const demoMode = searchParams.get("demo") === "true";

  useEffect(() => {
    // local sample SKUs — keeps the filters and product pages walkable with no
    // API behind them
    const showDemoCatalogue = () => {
      setProducts(filterDemoProducts({ category, chain, search, seasonal }));
      setTrack(getTrack());
      setIsDemoCatalogue(true);
    };

    const fetchProducts = async () => {
      setLoading(true);

      if (demoMode) {
        showDemoCatalogue();
        setIsRateLimited(false);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/products", {
          params: { category, chain, search, seasonal: seasonal || undefined },
        });
        // the API tells us which door it answered — never assume
        setIsRateLimited(false);
        if (res.data.products.length === 0) {
          // The catalogue answered but has nothing in it — an unseeded
          // database rather than a search with no matches. Show the demo
          // counter instead of a dead page. A genuine no-match search still
          // ends up empty, because the demo list gets the same filters.
          showDemoCatalogue();
        } else {
          setTrack(res.data.track);
          setProducts(res.data.products);
          setIsDemoCatalogue(false);
        }
      } catch (error) {
        console.log("Error fetching products");
        console.log(error);
        if (error.response?.status === 429) {
          //429 means rate limited
          setIsRateLimited(true);
          setIsDemoCatalogue(false);
        } else {
          // the API is down — show the demo counter rather than an empty page
          showDemoCatalogue();
          toast("Showing the demo catalogue while the API is unavailable");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, chain, search, seasonal, demoMode]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all" || value === "false") next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  const setDemoMode = (enabled) => {
    const next = new URLSearchParams(searchParams);
    if (enabled) next.set("demo", "true");
    else next.delete("demo");
    setSearchParams(next);
  };

  const isWholesale = track === "wholesale";
  const activeCategory = CATEGORIES.find((c) => c.value === category);

  return (
    <div className="min-h-screen bg-sop-bone-100">
      <Navbar active="Catalogue" />
      {isRateLimited && <RateLimitedUI />}

      {/* ------------------------ category head ------------------------ */}
      <section className="grid bg-sop-loin lg:grid-cols-[1.25fr_.75fr]">
        <div className="px-4 pb-6 pt-6 lg:px-11 lg:pb-12 lg:pt-[52px]">
          <span className="mb-3 block font-plex text-[11px] leading-none text-sop-rust lg:mb-[18px] lg:text-xs">
            <Link to="/" className="hover:text-sop-ink">
              Home
            </Link>{" "}
            · {activeCategory?.label || "Everything"}
          </span>
          <h1 className="mb-2.5 font-display text-[46px] leading-[.92] tracking-[-.02em] text-sop-ink lg:mb-4 lg:text-[88px] lg:leading-[.86] lg:tracking-[-.025em]">
            {isWholesale
              ? "Rate card"
              : isDemoCatalogue
              ? "Demo counter"
              : activeCategory?.label || "The counter"}
          </h1>
          <p className="max-w-[34ch] text-[14.5px] leading-[1.6] text-sop-ink-70 lg:max-w-[44ch] lg:text-[17px] lg:leading-[1.55]">
            {isWholesale
              ? `Case pricing on the same cuts we sell at the counter. Minimum order ${formatINR(
                  WHOLESALE.minOrderValue
                )} per drop · cut-off ${WHOLESALE.orderCutOff}.`
              : `Pork, charcuterie, steak, seafood and poultry — cut and packed to spec, every SKU carrying its chain, its farm and its cooking note. Minimum cart ${formatINR(
                  RETAIL.minCartValue
                )}, free delivery over ${formatINR(RETAIL.freeDeliveryOver)}.`}
          </p>

          {/* the demo counter runs on local sample SKUs, with no API behind it */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setDemoMode(!demoMode)}
              className="inline-flex min-h-[44px] items-center border-[1.5px] border-sop-ink px-4 font-archivo font-semibold text-[10.5px] leading-none tracking-[.12em] uppercase text-sop-ink hover:bg-sop-ink hover:text-sop-bone-100"
            >
              {demoMode ? "Back to the live counter" : "Open the demo counter"}
            </button>
            {isDemoCatalogue && (
              <span className="max-w-[42ch] font-plex text-[11px] leading-[1.6] text-sop-rust">
                Local sample SKUs. Filters and product pages work; orders need the API.
              </span>
            )}
          </div>
        </div>

        <Hatch
          from="#E8A79D"
          to="#EFB2A8"
          className="hidden items-end p-4 lg:flex"
        >
          <span className="font-plex text-[11px] leading-[1.6] text-sop-rust">
            category still · three cuts laid in a row
            <br />
            top-lit, seamless, scale rule
          </span>
        </Hatch>
      </section>

      <div className="grid lg:grid-cols-[270px_1fr]">
        {/* ------------------------- the rail -------------------------- */}
        <aside className="hidden border-r border-sop-bone-300 bg-sop-bone-200 px-6 pb-10 pt-7 lg:block">
          <span className="sop-eyebrow mb-4 block text-sop-ink-50">The families</span>
          {CATEGORIES.map((c) => {
            const on = c.value === category;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setParam("category", c.value)}
                className={`flex w-full items-baseline justify-between gap-2 border-t border-sop-bone-300 py-3 text-left ${
                  on ? "text-sop-ink" : "text-sop-ink-70 hover:text-sop-ink"
                }`}
              >
                <span className="font-display text-[23px] leading-none">{c.label}</span>
                {on && (
                  <span className="font-plex text-[10.5px] leading-none text-sop-cured">
                    {products.length}
                  </span>
                )}
              </button>
            );
          })}

          <div className="mt-6 bg-sop-ink p-4">
            <span className="mb-2.5 block font-archivo font-semibold text-[10px] leading-none tracking-[.16em] uppercase text-sop-loin">
              Not sure which cut?
            </span>
            <span className="mb-3.5 block font-plex text-xs leading-[1.6] text-sop-ash">
              Every product page maps the cut to its place on the animal and what it is for.
            </span>
            <Link to="/canada-story" className="sop-btn-loin min-h-[44px] px-4 text-[11px]">
              How we source
            </Link>
          </div>
        </aside>

        {/* min-w-0: a grid item defaults to min-width:auto, so without this the
            column stretches to the widest filter row and the whole page scrolls
            sideways instead of the filter strips scrolling inside it */}
        <div className="min-w-0">
          {/* --------------------- the filter bar ---------------------- */}
          {/* sticks below the header, not behind it */}
          <div
            style={{ top: "var(--sop-nav-h, 0px)" }}
            className="sticky z-40 border-b border-sop-ink bg-sop-bone-100"
          >
            {/* families — one scrolling strip on mobile */}
            <div className="flex gap-2 overflow-x-auto px-4 pb-2.5 pt-3 lg:flex-wrap lg:px-8 lg:pt-4">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setParam("category", c.value)}
                  className={`flex-none ${
                    c.value === category ? "sop-chip-on" : "sop-chip-off"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* chains — its own strip, so four long labels can't widen the page */}
            <div className="flex overflow-x-auto px-4 pb-2.5 lg:px-8">
              <div className="inline-flex flex-none border-[1.5px] border-sop-ink">
                {[["all", "All"], ...Object.entries(CHAINS).map(([k, v]) => [k, v.label])].map(
                  ([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setParam("chain", value)}
                      className={`px-3 py-2.5 font-archivo font-semibold text-[10.5px] leading-none tracking-[.12em] uppercase ${
                        chain === value
                          ? "bg-sop-ink text-sop-bone-100"
                          : "bg-sop-bone-100 text-sop-ink"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* search, seasonal and the count wrap freely */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 pb-3 lg:px-8">
              <input
                type="text"
                className="sop-input h-11 min-w-0 flex-1 sm:max-w-[240px]"
                placeholder="Search a cut or a SKU"
                value={search}
                onChange={(e) => setParam("search", e.target.value)}
              />

              <label className="inline-flex cursor-pointer items-center gap-2 border border-sop-bone-300 px-3 py-2.5">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 accent-sop-ink"
                  checked={seasonal}
                  onChange={(e) => setParam("seasonal", String(e.target.checked))}
                />
                <span className="whitespace-nowrap font-archivo font-semibold text-[10.5px] leading-none tracking-[.12em] uppercase text-sop-ink-70">
                  Seasonal
                </span>
              </label>

              <span className="whitespace-nowrap font-plex text-[11px] leading-none text-sop-ink-50 lg:text-[11.5px]">
                {loading ? "loading…" : `${products.length} SKUs`}
              </span>
            </div>
          </div>

          {/* ------------------------ the grid ------------------------- */}
          {!loading && products.length === 0 && !isRateLimited && (
            <EmptyState
              title="Nothing matches that"
              message="Try a wider filter, or search by the cut rather than the dish."
              actionLabel="Clear the filters"
              actionTo="/catalogue"
            />
          )}

          {products.length > 0 && !isRateLimited && (
            <div className="grid grid-cols-1 gap-2.5 px-4 py-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3 lg:px-8 lg:py-8">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  track={track}
                  demoMode={isDemoCatalogue}
                />
              ))}
            </div>
          )}

          {/* -------------------- kitchen quantities -------------------- */}
          {!isWholesale && (
            <div className="mx-4 mb-9 flex flex-col justify-between gap-4 bg-sop-blush p-4 sm:flex-row sm:items-center lg:mx-8 lg:p-6">
              <div className="flex flex-col gap-1.5">
                <span className="font-archivo font-semibold text-[10.5px] leading-none tracking-[.16em] uppercase text-sop-rust">
                  Kitchen quantities
                </span>
                <span className="font-display text-[24px] leading-none text-sop-ink lg:text-[28px]">
                  Case rates on a trade account
                </span>
                <span className="font-plex text-xs leading-[1.5] text-sop-ink-70">
                  5 kg and 10 kg cases · MOQ per SKU · spec sheet on every line
                </span>
              </div>
              <Link to="/wholesale" className="sop-btn-ember whitespace-nowrap lg:min-h-[50px] lg:px-6">
                Request rate card
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CataloguePage;
