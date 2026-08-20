import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hatch from "../components/Hatch";
import NonVegMark from "../components/NonVegMark";
import api from "../lib/axios";
import demoProducts from "../lib/demoProducts";
import { formatINR } from "../lib/utils";
import { CATEGORIES, CHAINS, SEASONAL_CALENDAR } from "../lib/trade";

// Principles 1–6, in the order we actually run the business.
const principles = [
  {
    n: "01",
    head: "The cold chain is the product",
    body: "Three chains, not one. Fresh chilled, frozen and ready-to-eat cured each run at their own temperature, carry their own risks, and arrive with their own handling instructions printed on the box.",
    proof: "Probe reading at every handover, printed on the receipt",
  },
  {
    n: "02",
    head: "Provenance, farm to breed",
    body: "Pork tells you the farm, the feed and the breed. Steak tells you origin and grade. Seafood tells you catch method and landing region. If we can't name it, we don't list it.",
    proof: "Lot code on every pack, walking back to the barn",
  },
  {
    n: "03",
    head: "Cut literacy is a sales function",
    body: "Nobody in India grows up knowing what a coppa is, or how picanha differs from ribeye. Every product page says what it is, where it sits on the animal, how to cook it, at what temperature, for how long.",
    proof: "Method, core temperature and timing on every SKU",
  },
  {
    n: "04",
    head: "Consistency of spec",
    body: "Portion weight tolerance, steak thickness, slice thickness on cold cuts. Chefs cost their menus on these numbers, so we publish them and hold them.",
    proof: "Downloadable spec sheet per SKU on a trade account",
  },
  {
    n: "05",
    head: "Honest about frozen",
    body: "Much of this range is necessarily frozen or imported. Frozen is not a weakness — badly thawed is. We say what's fresh, what's frozen, what's ambient-cured, and we give you the thawing instructions.",
    proof: "Thawing time per kilo on every frozen pack",
  },
  {
    n: "06",
    head: "Seasonal readiness",
    body: "Turkey is a Christmas business and duck spikes around it. Pre-orders open on 1 October against a confirmed flock allocation, so nobody is scrambling in November.",
    proof: "Calendar published in advance, pre-order cut-off 30 Nov",
  },
];

const categoryShots = {
  pork: "pork loin, whole",
  "cold-cuts": "salami, cut face up",
  steak: "ribeye, 32 mm",
  seafood: "salmon side, portioned",
  poultry: "duck breast, skin scored",
};

const sourcingStats = [
  { n: "3", label: "processors, all CFIA-audited" },
  { n: "100%", label: "lots traceable to farm" },
  { n: "7 yr", label: "working the same barns" },
];

const LandingPage = () => {
  const [bestsellers, setBestsellers] = useState([]);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const res = await api.get("/products");
        // without this the whole rail vanishes when the catalogue is unseeded,
        // leaving a hole in the middle of the homepage
        setBestsellers((res.data.products.length ? res.data.products : demoProducts).slice(0, 5));
      } catch (error) {
        // the rail is decoration on this page — a failure here must not take
        // the homepage down with it
        console.log("Could not load the bestseller rail", error);
        setBestsellers(demoProducts.slice(0, 5));
      }
    };

    fetchBestsellers();
  }, []);

  const categories = CATEGORIES.filter((c) => c.value !== "all");

  return (
    <div className="min-h-screen bg-sop-bone-100">
      <Navbar />

      {/* ---------------------------- hero ----------------------------- */}
      <section className="grid lg:grid-cols-[1.06fr_.94fr]">
        <Hatch className="order-1 flex h-[430px] items-start justify-end p-3.5 lg:order-2 lg:h-auto lg:min-h-[600px] lg:items-end lg:p-5">
          <span className="text-right font-plex text-[10px] leading-[1.5] text-sop-ink-50 lg:text-left lg:text-[11.5px] lg:leading-[1.6]">
            hero · pork belly slab, skin scored
            <br />
            top-lit on neutral seamless · honest colour
            <br />
            steel rule for scale · full-bleed 4:5
          </span>
        </Hatch>

        <div className="order-2 flex flex-col justify-between px-4 pb-6 lg:order-1 lg:px-11 lg:pb-14 lg:pt-16">
          <div>
            <span className="sop-eyebrow mb-6 hidden text-sop-cured lg:block">
              Continental protein house · est. 2019
            </span>
            {/* The comp forces its line breaks and the overlap depends on them:
                three lines on mobile, two on desktop.

                The bone knockout is one slab behind the whole headline, not a
                per-line inline background. At leading .92 each line box is 67px
                tall but only 47.8px apart, so per-line backgrounds painted over
                the previous line's descenders — that is what read as overlapping
                text. The negative left margin keeps the glyphs aligned with the
                paragraph while the slab overhangs. */}
            <h1 className="relative -ml-2.5 -mt-[92px] mb-0 inline-block bg-sop-bone-100 px-2.5 pb-1.5 pt-2 font-display text-[52px] leading-[.92] tracking-[-.02em] text-sop-ink lg:ml-0 lg:mb-6 lg:mt-0 lg:bg-transparent lg:p-0 lg:text-[104px] lg:leading-[.88] lg:tracking-[-.025em]">
              Pink is{" "}
              <br className="lg:hidden" />
              a promise
              <br />
              we keep <span className="italic">cold</span>
            </h1>
            <p className="mt-5 max-w-[32ch] text-[15px] leading-[1.55] text-sop-ink-70 lg:mt-0 lg:max-w-[46ch] lg:text-[17px]">
              Premium pork, charcuterie and continental proteins — sourced to Canadian quality
              standards, cut to spec, delivered farm-to-fork on an unbroken chain.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-11">
            <Link to="/catalogue" className="sop-btn-ember flex-1 lg:flex-none lg:min-h-[52px] lg:px-7">
              Shop the counter
            </Link>
            <Link to="/wholesale" className="sop-btn-outline flex-1 lg:flex-none lg:min-h-[52px] lg:px-7">
              Wholesale
            </Link>
            <span className="hidden font-plex text-xs leading-[1.5] text-sop-ink-50 lg:ml-2 lg:block">
              or WhatsApp
              <br />
              +91 98860 41207
            </span>
          </div>
        </div>
      </section>

      {/* -------------------------- the counter ------------------------ */}
      <section className="border-t border-sop-bone-300 bg-sop-bone-200 px-4 pb-8 pt-7 lg:px-8 lg:pb-[60px] lg:pt-14">
        <div className="mb-4 flex items-baseline justify-between gap-4 lg:mb-6">
          <h2 className="font-display text-[27px] leading-none text-sop-ink lg:text-[46px]">
            The counter
          </h2>
          <Link
            to="/catalogue"
            className="border-b-[1.5px] border-sop-ember pb-[3px] font-archivo font-semibold text-[11px] leading-none tracking-[.14em] uppercase text-sop-ink"
          >
            All {categories.length} families →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-5 lg:gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/catalogue?category=${cat.value}`}
              className="border border-sop-bone-300 bg-sop-bone-100 transition-colors duration-[120ms] hover:border-sop-ink"
            >
              <Hatch from="#F7D9D3" to="#F3E3DE" className="flex h-24 items-end p-2 lg:h-[150px] lg:p-2.5">
                <span className="font-plex text-[9px] leading-[1.4] text-sop-rust lg:text-[10px]">
                  {categoryShots[cat.value]}
                </span>
              </Hatch>
              <div className="px-3 pb-3.5 pt-2.5 lg:px-4 lg:pb-4 lg:pt-4">
                <span className="block font-display text-[19px] leading-[1.05] text-sop-ink lg:text-[26px]">
                  {cat.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------------- how we run it (1–6) --------------------- */}
      <section
        id="about"
        className="border-t border-sop-bone-300 bg-sop-bone-100 px-4 pb-8 pt-7 lg:px-11 lg:pb-[60px] lg:pt-14"
      >
        <span className="sop-eyebrow mb-4 block text-sop-cured lg:mb-[26px]">
          How we run it · six principles
        </span>
        <div className="grid gap-px border-t border-sop-ink bg-sop-bone-300 lg:grid-cols-3">
          {principles.map((p) => (
            // padded off its dividers; the first cell in each row stays flush
            // with the section edge so it lines up with the heading above
            <div
              key={p.n}
              className="bg-sop-bone-100 py-[18px] lg:px-6 lg:py-6 lg:[&:nth-child(3n+1)]:pl-0"
            >
              <span className="mb-2 block font-plex text-[11px] leading-none text-sop-cured lg:mb-3.5 lg:text-xs">
                {p.n}
              </span>
              <h3 className="mb-2.5 font-display text-[26px] leading-[1.05] text-sop-ink lg:mb-3 lg:text-[32px] lg:leading-[1.02]">
                {p.head}
              </h3>
              <p className="mb-2.5 text-[14px] leading-[1.6] text-sop-ink-70 lg:mb-3.5 lg:text-[14.5px]">
                {p.body}
              </p>
              <span className="block font-plex text-[11px] leading-[1.5] text-sop-ink-50 lg:text-[11.5px] lg:leading-[1.55]">
                {p.proof}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------- sourcing + cold chain spread ---------------- */}
      <section className="grid lg:grid-cols-2">
        <div id="sourcing" className="bg-sop-loin px-4 pb-8 pt-7 lg:px-11 lg:pb-16 lg:pt-[60px]">
          <span className="sop-eyebrow mb-3.5 block text-sop-rust lg:mb-5">Our sourcing</span>
          <h2 className="mb-3.5 font-display text-[38px] leading-[.98] tracking-[-.015em] text-sop-ink lg:mb-5 lg:text-[60px] lg:leading-[.95] lg:tracking-[-.02em]">
            Canadian standards,
            <br />
            <span className="italic">held all the way</span>
          </h2>
          <p className="mb-5 max-w-[34ch] text-[14.5px] leading-[1.6] text-sop-ink-70 lg:mb-7 lg:max-w-[42ch] lg:text-[16px]">
            We work with a short list of audited processors and grade every lot the way Canada does
            — carcass class, fat depth, pH, drip loss. Nothing enters our chain without a lot code
            that walks back to the barn.
          </p>

          <Hatch
            from="#E8A79D"
            to="#EFB2A8"
            className="mb-[18px] flex h-[220px] items-end p-3 lg:hidden"
          >
            <span className="font-plex text-[10px] leading-[1.5] text-sop-rust">
              documentary · processing floor or barn
              <br />
              honest colour, no styling · 16:9
            </span>
          </Hatch>

          <div className="mb-5 grid grid-cols-3 gap-px bg-sop-ink lg:mb-7">
            {sourcingStats.map((s) => (
              <div key={s.label} className="bg-sop-loin px-2.5 py-3 lg:px-3.5 lg:py-4">
                <span className="block font-display text-[30px] leading-none text-sop-ink lg:text-[42px]">
                  {s.n}
                </span>
                <span className="mt-1.5 block font-plex text-[10px] leading-[1.35] text-sop-rust lg:text-[11px] lg:leading-[1.4]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <Link to="/canada-story" className="sop-btn-ink lg:min-h-[50px] lg:px-6 lg:text-[12.5px]">
            Read the Canada story
          </Link>
        </div>

        <div id="coldchain" className="bg-sop-ink px-4 pb-8 pt-7 lg:px-11 lg:pb-16 lg:pt-[60px]">
          <span className="sop-eyebrow mb-3.5 block text-sop-chill lg:mb-5">
            Cold chain · proof, not claims
          </span>
          <h2 className="mb-5 font-display text-[34px] leading-none text-sop-bone-100 lg:mb-[26px] lg:text-[52px] lg:leading-[.98]">
            Three chains.
            <br />
            One temperature log.
          </h2>

          <div className="border-t border-sop-ink-70">
            {Object.entries(CHAINS).map(([key, chain]) => (
              <div
                key={key}
                className="flex items-baseline justify-between gap-3.5 border-b border-sop-ink-70 py-3.5 lg:gap-5 lg:py-[15px]"
              >
                <div className="flex flex-col gap-1 lg:gap-[5px]">
                  <span className="font-archivo font-medium text-xs leading-none tracking-[.12em] uppercase text-sop-bone-100 lg:text-[12.5px]">
                    {chain.label}
                  </span>
                  <span className="font-plex text-[10.5px] leading-[1.45] text-sop-ink-40 lg:text-[11.5px]">
                    {chain.risk}
                  </span>
                </div>
                <span className="flex-none whitespace-nowrap font-plex text-[13px] leading-none text-sop-chill lg:text-[16px]">
                  {chain.temp}
                </span>
              </div>
            ))}
          </div>

          <p className="mb-5 mt-[18px] max-w-[36ch] text-[13.5px] leading-[1.6] text-sop-ash lg:mb-[26px] lg:mt-6 lg:max-w-[44ch] lg:text-[14.5px]">
            Every carton carries its own journey: probe readings at each handover, packer, lot and
            kill date. If a reading breaks, the lot doesn't ship.
          </p>
          <Link to="/cold-chain" className="sop-btn-loin lg:min-h-[50px] lg:px-6 lg:text-[12.5px]">
            See a sample log
          </Link>
        </div>
      </section>

      {/* ------------------------ moving fastest ------------------------ */}
      {bestsellers.length > 0 && (
        <section className="border-t border-sop-bone-300 bg-sop-bone-100 pb-8 pt-7 lg:pb-[60px] lg:pt-14">
          <div className="mb-4 flex items-baseline justify-between gap-4 px-4 lg:mb-6 lg:px-8">
            <h2 className="font-display text-[27px] leading-none text-sop-ink lg:text-[46px]">
              Moving fastest
            </h2>
            <span className="font-plex text-[11px] leading-none text-sop-ink-50 lg:text-xs">
              swipe →
            </span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto px-4 pb-2 lg:gap-3 lg:px-8">
            {bestsellers.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="w-[236px] flex-none border border-sop-bone-300 bg-sop-bone-100 transition-colors duration-[120ms] hover:border-sop-ink lg:w-[282px]"
              >
                <Hatch className="flex h-[200px] items-start justify-between p-2.5 lg:h-[240px]">
                  <span className="bg-sop-bone-100 px-2 py-1.5 font-plex font-medium text-[9.5px] leading-none tracking-[.08em] uppercase text-sop-ink">
                    {CHAINS[p.chain]?.label}
                  </span>
                  <NonVegMark size={22} />
                </Hatch>
                <div className="px-3.5 pb-4 pt-3.5 lg:px-4">
                  <span className="mb-2 block font-archivo font-semibold text-[9.5px] leading-none tracking-[.16em] uppercase text-sop-cured">
                    {p.category.replace("-", " ")}
                  </span>
                  <span className="block font-display text-[23px] leading-[1.05] text-sop-ink lg:text-[28px]">
                    {p.name}
                  </span>
                  <span className="mt-2 block font-plex text-[11px] leading-[1.5] text-sop-ink-50">
                    {p.retail.packSizeG} g pack · {p.sku}
                  </span>
                  <div className="mt-3 flex items-baseline justify-between border-t border-sop-bone-300 pt-3">
                    <span className="font-medium text-[16px] leading-none text-sop-ink lg:text-[18px]">
                      {formatINR(p.retail.price)}
                    </span>
                    <span className="font-plex text-[10.5px] leading-none text-sop-ink-50">
                      {formatINR(Math.round((p.retail.price / p.retail.packSizeG) * 1000))} / kg
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* --------------- compliance + cut guides + calendar ------------- */}
      <section className="grid border-t border-sop-bone-300 lg:grid-cols-[1fr_1fr]">
        <div id="compliance" className="border-b border-sop-bone-300 bg-sop-bone-200 px-4 pb-8 pt-7 lg:border-b-0 lg:border-r lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className="sop-eyebrow mb-3.5 block text-sop-ink-50">Quality &amp; compliance</span>
          <h2 className="mb-3.5 font-display text-[30px] leading-none text-sop-ink lg:text-[46px]">
            What we check, and what fails it
          </h2>
          <p className="mb-4 max-w-[40ch] text-[14px] leading-[1.6] text-sop-ink-70 lg:text-[15px]">
            FSSAI-licensed cold room and cutting floor, HACCP plan on file, temperature logs from
            dispatch to doorstep. Trade accounts get the batch certificate and a spec sheet with
            every SKU, and we invoice against your GSTIN.
          </p>
          <div className="border-t border-sop-ink">
            {[
              ["Core temp on receipt", "≤ −15 °C frozen"],
              ["Portion weight", "held to ± 5 %"],
              ["Drip loss", "≤ 3 %"],
              ["Seal & pack", "zero leakers"],
            ].map(([k, v]) => (
              <div key={k} className="sop-row">
                <span className="sop-key">{k}</span>
                <span className="sop-val">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div id="cuts" className="bg-sop-bone-100 px-4 pb-8 pt-7 lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className="sop-eyebrow mb-3.5 block text-sop-cured">Cut guides &amp; recipes</span>
          <h2 className="mb-3.5 font-display text-[30px] leading-none text-sop-ink lg:text-[46px]">
            Know the muscle <span className="italic">before</span> you know the recipe
          </h2>
          <p className="mb-5 max-w-[40ch] text-[14px] leading-[1.6] text-sop-ink-70 lg:text-[15px]">
            Teaching the cut is part of selling it. Open any product and you get what it is, where
            it sits on the animal, the cooking method, the target core temperature and the timing —
            plus the chef note that stops the usual mistake.
          </p>

          <div className="mb-6 border-t border-sop-ink">
            {[
              ["Whole cuts", "63 °C · rest 3 min"],
              ["Mince & sausage", "71 °C"],
              ["Shoulder & ribs", "90 – 94 °C"],
              ["Reheating cooked", "74 °C"],
            ].map(([k, v]) => (
              <div key={k} className="sop-row">
                <span className="sop-key">{k}</span>
                <span className="sop-val">{v}</span>
              </div>
            ))}
          </div>

          <Link to="/cut-guide" className="sop-btn-outline">
            Open the cut guide
          </Link>
        </div>
      </section>

      {/* ------------------------ seasonal calendar --------------------- */}
      <section className="border-t border-sop-bone-300 bg-sop-blush px-4 pb-8 pt-7 lg:px-11 lg:pb-14 lg:pt-[52px]">
        <span className="sop-eyebrow mb-3.5 block text-sop-rust">Seasonal readiness</span>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-baseline">
          <h2 className="font-display text-[30px] leading-none text-sop-ink lg:text-[46px]">
            Turkey is a Christmas business
          </h2>
          <span className="max-w-[40ch] font-plex text-[11.5px] leading-[1.6] text-sop-rust">
            The year, published in advance, with pre-orders instead of a November scramble.
          </span>
        </div>

        <div className="mt-5 border-t border-sop-ink">
          {SEASONAL_CALENDAR.map((entry) => (
            <div
              key={entry.month}
              className="flex flex-col gap-1 border-b border-sop-blush-edge py-3 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="w-40 shrink-0 font-plex text-[12.5px] leading-none text-sop-rust">
                {entry.month}
              </span>
              <span className="text-[14px] leading-[1.55] text-sop-ink-70">{entry.note}</span>
            </div>
          ))}
        </div>

        <Link to="/catalogue?seasonal=true" className="sop-btn-ink mt-5">
          See what's on pre-order
        </Link>
      </section>

      {/* --------------------------- two doors -------------------------- */}
      <section className="grid gap-px border-t border-sop-bone-300 bg-sop-bone-300 lg:grid-cols-2">
        <div className="bg-sop-bone-100 px-4 pb-7 pt-[26px] lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className="sop-eyebrow mb-2.5 block text-sop-cured lg:mb-3.5">For the home</span>
          <h2 className="mb-2.5 font-display text-[32px] leading-none text-sop-ink lg:mb-3.5 lg:text-[52px]">
            Shop the counter
          </h2>
          <p className="mb-4 max-w-[32ch] text-[14px] leading-[1.6] text-sop-ink-70 lg:mb-6 lg:max-w-[40ch] lg:text-[16px]">
            Single packs, honest weights, cook notes on every cut. 200 g and 500 g retail packs,
            next-day chilled across the city.
          </p>
          <Link to="/catalogue" className="sop-btn-ember lg:min-h-[50px] lg:px-6 lg:text-[12.5px]">
            Start shopping
          </Link>
        </div>

        <div className="bg-sop-ink px-4 pb-7 pt-[26px] lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className="sop-eyebrow mb-2.5 block text-sop-loin lg:mb-3.5">For kitchens</span>
          <h2 className="mb-2.5 font-display text-[32px] leading-none text-sop-bone-100 lg:mb-3.5 lg:text-[52px]">
            Wholesale &amp; HORECA
          </h2>
          <p className="mb-4 max-w-[32ch] text-[14px] leading-[1.6] text-sop-ash lg:mb-6 lg:max-w-[40ch] lg:text-[16px]">
            Case sizes, rate card, credit terms, order cut-off the evening before dispatch. Spec
            sheets on every SKU.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/wholesale" className="sop-btn-loin lg:min-h-[50px] lg:px-[22px] lg:text-[12.5px]">
              Request rate card
            </Link>
            <Link
              to="/wholesale"
              className="sop-btn-outline-light lg:min-h-[50px] lg:px-[22px] lg:text-[12.5px]"
            >
              Open an account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
