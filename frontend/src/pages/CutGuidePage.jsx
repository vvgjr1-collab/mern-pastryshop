import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../lib/axios";
import { addToCart } from "../lib/cart";
import { getTrack } from "../lib/account";
import { formatINR } from "../lib/utils";
import demoProducts from "../lib/demoProducts";

// Cut Guide · primal map + cook-method lookup.
// Tap a primal on the carcass map to change everything below it. The method
// chips filter that primal's cuts, so the page answers both directions: what
// is this cut, and what should I buy to braise.

const primals = {
  shoulder: {
    name: "Shoulder",
    eyebrow: "Primal 01 · front quarter",
    body: "The hardest-working muscle group on the animal, so it is threaded with collagen and intramuscular fat. That is a gift, not a fault: given hours, the collagen turns to gelatin and the meat shreds. Rushed, it is tough.",
    facts: [
      ["Fat", "High · marbled through"],
      ["Collagen", "Very high"],
      ["Time", "3 – 6 h"],
      ["Yield", "72 % after bone"],
    ],
  },
  loin: {
    name: "Loin",
    eyebrow: "Primal 02 · back",
    body: "Along the spine, barely used, so it is lean, fine-grained and quick. Everything here is about not overcooking: a chop is done at 63 °C and dry at 70. Buy it thick — 22 mm minimum — and rest it.",
    facts: [
      ["Fat", "Low · fat cap only"],
      ["Collagen", "Low"],
      ["Time", "6 – 25 min"],
      ["Yield", "88 % boneless"],
    ],
  },
  belly: {
    name: "Belly",
    eyebrow: "Primal 03 · underside",
    body: "Alternating bands of fat and muscle, which is why it is the most forgiving cut in the shop. Slow first to render, hot last to crisp. It is also the bacon cut, so buy it whole if you want to cure.",
    facts: [
      ["Fat", "Very high · layered"],
      ["Collagen", "Medium"],
      ["Time", "2 – 3 h, then blast"],
      ["Yield", "94 % skinless"],
    ],
  },
  ribs: {
    name: "Ribs",
    eyebrow: "Primal 04 · rib cage",
    body: "Two racks come off the same cage and behave differently: baby backs are loin-adjacent and leaner, spares sit against the belly and carry more fat. Both want low heat until the meat pulls back from the bone.",
    facts: [
      ["Fat", "Medium to high"],
      ["Collagen", "High"],
      ["Time", "2.5 – 4 h"],
      ["Yield", "Serves 2 per rack"],
    ],
  },
  leg: {
    name: "Leg & ham",
    eyebrow: "Primal 05 · hind quarter",
    body: "Big, lean, dense muscles with little marbling. Whole, it is the festive roast and the ham cut; broken down, it slices thin for schnitzel or cubes for slow curries. It punishes overcooking harder than the loin.",
    facts: [
      ["Fat", "Low · cap and seam"],
      ["Collagen", "Medium"],
      ["Time", "8 min – 4 h"],
      ["Yield", "76 % after bone"],
    ],
  },
  trim: {
    name: "Trim & charcuterie",
    eyebrow: "Primal 06 · trim and extremities",
    body: "The parts that make everything else taste better — ground for sausage, emulsified for mortadella, or cured whole. Ordered for a reason, not by accident.",
    facts: [
      ["Fat", "Varies by cut"],
      ["Collagen", "Highest on the animal"],
      ["Time", "10 min – 8 h"],
      ["Yield", "Stock: 1 kg per 2 L"],
    ],
  },
};

const methods = ["Roast", "Grill", "Braise", "Fry", "Smoke", "Cure"];

const temps = [
  { k: "Whole cuts", v: "63 °C", note: "chops, loin, tenderloin, leg roast · rest 3 min" },
  { k: "Mince & sausage", v: "71 °C", note: "no rest required, check in two places" },
  { k: "Shoulder & ribs", v: "90 – 94 °C", note: "past done, on purpose — collagen melts here" },
  { k: "Belly, then crisp", v: "88 °C, then 240 °C", note: "render low, blast the skin for 15 min" },
  { k: "Reheating cooked", v: "74 °C", note: "hams, sausages, ready-to-eat charcuterie" },
];

const thaw = [
  { k: "Fridge · best", v: "12 h per kg", note: "Lowest drip loss. Leave sealed, on a tray, bottom shelf." },
  { k: "Cold water · quick", v: "1 h per kg", note: "Sealed pack fully submerged, change the water every 30 min." },
  { k: "Room temperature", v: "Never", note: "The surface enters the danger zone long before the centre thaws." },
];

const swaps = [
  {
    from: "Pork butt / picnic (US)",
    to: "Shoulder · Boston butt",
    why: "Nothing to do with the rear leg — American butchery names the shoulder this way.",
  },
  {
    from: "Pork fillet (UK)",
    to: "Loin · tenderloin",
    why: "The single muscle inside the ribs, not the boneless loin.",
  },
  {
    from: "Bacon lardons",
    to: "Belly · dry-cured streaky",
    why: "Ours is dry-cured, so it renders instead of leaking water into the pan.",
  },
  {
    from: "Samgyeopsal",
    to: "Belly · slab, sliced 12 mm",
    why: "Thickness is the whole cut. Anything thinner curls and dries.",
  },
];

const specable = [
  ["Chop thickness", "18 – 45 mm"],
  ["Fat cap", "trimmed to 3 mm up"],
  ["Portion weight", "± 10 g held"],
  ["Slice thickness", "1 – 3 mm on cold cuts"],
];

// the map is a schematic, not to scale — head end left, tail end right
const mapCells = [
  { key: "shoulder", area: "shoulder", label: "Shoulder", sub: "collagen · slow", tall: true },
  { key: "loin", area: "loin", label: "Loin", sub: "" },
  { key: "ribs", area: "ribs", label: "Ribs", sub: "" },
  { key: "belly", area: "belly", label: "Belly", sub: "" },
  { key: "leg", area: "leg", label: "Leg & ham", sub: "lean · dense", tall: true },
  { key: "trim", area: "trim", label: "Trim & charcuterie", sub: "" },
];

const CutGuidePage = () => {
  const [primal, setPrimal] = useState("shoulder");
  const [method, setMethod] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [track, setTrack] = useState(getTrack());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setTrack(res.data.track);
        // an unseeded catalogue would leave every primal reading "we aren't
        // carrying this" — teach the cuts off the demo SKUs instead
        setProducts(res.data.products.length ? res.data.products : demoProducts);
      } catch (error) {
        console.log("Error loading the cut guide catalogue", error);
        // the guide still teaches the cuts with no API behind it
        setProducts(demoProducts);
        setTrack(getTrack());
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const isWholesale = track === "wholesale";
  const p = primals[primal];

  const inPrimal = products.filter((prod) => prod.primal === primal);
  const shown = method
    ? inPrimal.filter((prod) => (prod.methods || []).includes(method))
    : inPrimal;

  // where else that method lives, so an empty list can point somewhere
  const alternatives = method
    ? Object.keys(primals).filter(
        (key) =>
          key !== primal &&
          products.some(
            (prod) => prod.primal === key && (prod.methods || []).includes(method)
          )
      )
    : [];

  const countLine = method
    ? `${shown.length} of ${inPrimal.length} cuts · ${method.toLowerCase()}`
    : `${inPrimal.length} cut${inPrimal.length === 1 ? "" : "s"} in ${p.name.toLowerCase()}`;

  const handleAdd = (prod) => {
    const minQty = isWholesale ? prod.wholesale?.moqCases || 1 : 1;
    const unitPrice = isWholesale
      ? prod.wholesale.pricePerKg * prod.wholesale.caseSizeKg
      : prod.retail.price;
    const packLabel = isWholesale
      ? `${prod.wholesale.caseSizeKg} kg case`
      : `${prod.retail.packSizeG} g pack`;

    addToCart(
      {
        productId: prod._id,
        sku: prod.sku,
        name: prod.name,
        image: prod.image,
        chain: prod.chain,
        packLabel,
        unitPrice,
        quantity: minQty,
        minQty,
        isPreOrder: !!(prod.seasonal?.isSeasonal && prod.seasonal?.preOrderOpen),
      },
      isWholesale ? "wholesale" : "retail"
    );

    toast.success(`${prod.name} · ${minQty} × ${packLabel}`);
  };

  return (
    <div className="min-h-screen bg-sop-bone-100">
      <Navbar active="Cut guide" />

      {/* ---------------------------- hero ----------------------------- */}
      <section className="grid items-end gap-6 border-b border-sop-bone-300 bg-sop-blush px-4 pb-7 pt-7 lg:grid-cols-[1.15fr_.85fr] lg:gap-11 lg:px-11 lg:pb-12 lg:pt-14">
        <div>
          <span className="sop-eyebrow mb-3.5 block text-sop-rust lg:mb-5">
            Cut guide · six primals
          </span>
          <h1 className="font-display text-[42px] leading-[.95] tracking-[-.015em] text-sop-ink lg:text-[78px] lg:leading-[.9] lg:tracking-[-.025em]">
            Know the muscle <span className="italic">before</span> you know the recipe
          </h1>
        </div>
        <p className="max-w-[34ch] text-[14.5px] leading-[1.6] text-sop-ink-70 lg:max-w-[42ch] lg:text-[17px] lg:leading-[1.55]">
          Pork is not one ingredient. A shoulder wants four hours and a chop wants four minutes, and
          the difference is collagen, not price. Start on the carcass, end at a cut you can add to
          the order.
        </p>
      </section>

      <div className="grid lg:grid-cols-[.86fr_1.14fr]">
        {/* ------------------------ carcass map ------------------------ */}
        <div className="border-b border-sop-bone-300 bg-sop-bone-200 px-4 pb-8 pt-6 lg:border-b-0 lg:border-r lg:px-10 lg:pb-12 lg:pt-11">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <span className="sop-eyebrow text-sop-ink-50">The carcass map</span>
            <span className="font-plex text-[10.5px] leading-none text-sop-ink-50 lg:text-[11.5px]">
              tap a primal
            </span>
          </div>
          <div className="mb-2 flex justify-between font-plex text-[9.5px] leading-none text-sop-ink-50 lg:text-[10.5px]">
            <span>← head end</span>
            <span>tail end →</span>
          </div>

          <div
            className="grid gap-0.5 border border-sop-bone-300 bg-sop-bone-300"
            style={{
              gridTemplateColumns: "1fr 1.25fr 1fr",
              gridTemplateAreas:
                "'shoulder loin leg' 'shoulder ribs leg' 'shoulder belly leg' 'trim trim trim'",
            }}
          >
            {mapCells.map((cell) => {
              const on = cell.key === primal;
              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => setPrimal(cell.key)}
                  style={{ gridArea: cell.area }}
                  className={`flex flex-col justify-between gap-3 p-3 text-left transition-colors duration-[120ms] lg:p-3.5 ${
                    cell.tall ? "min-h-[110px] lg:min-h-[150px]" : "min-h-[52px]"
                  } ${on ? "bg-sop-loin" : "bg-sop-bone-100 hover:bg-sop-blush"}`}
                >
                  <span className="font-display text-[19px] leading-[1.02] text-sop-ink lg:text-[26px]">
                    {cell.label}
                  </span>
                  <span
                    className={`font-plex text-[10px] leading-[1.4] lg:text-[11px] lg:leading-[1.45] ${
                      on ? "text-sop-rust" : "text-sop-ink-50"
                    }`}
                  >
                    {products.filter((prod) => prod.primal === cell.key).length} in stock
                    {cell.sub && (
                      <>
                        <br />
                        {cell.sub}
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <span className="mt-2.5 block font-plex text-[10px] leading-[1.5] text-sop-ink-50 lg:mt-3 lg:text-[11px] lg:leading-[1.6]">
            Schematic, not to scale. A butchery diagram sits here in production — one side, primals
            ruled and labelled.
          </span>

          {/* the selected primal */}
          <div className="mt-7 border-t border-sop-ink pt-6 lg:mt-8">
            <span className="sop-eyebrow mb-2.5 block text-sop-cured">{p.eyebrow}</span>
            <h2 className="mb-3.5 font-display text-[34px] leading-none text-sop-ink lg:text-[44px]">
              {p.name}
            </h2>
            <p className="mb-5 max-w-[34ch] text-[14.5px] leading-[1.6] text-sop-ink-70 lg:max-w-[38ch] lg:text-[15.5px]">
              {p.body}
            </p>
            <div className="grid grid-cols-2 gap-px border border-sop-bone-300 bg-sop-bone-300">
              {p.facts.map(([k, v]) => (
                <div key={k} className="bg-sop-bone-100 px-3.5 py-3">
                  <span className="mb-1.5 block font-archivo font-semibold text-[9.5px] leading-none tracking-[.16em] uppercase text-sop-ink-50">
                    {k}
                  </span>
                  <span className="block font-plex text-[12.5px] leading-[1.4] text-sop-ink lg:text-[13px]">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --------------------- cuts we carry ------------------------- */}
        <div className="px-4 pb-8 pt-6 lg:px-11 lg:pb-12 lg:pt-11">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <span className="sop-eyebrow text-sop-ink-50">Cook it by</span>
            <span className="font-plex text-[10.5px] leading-none text-sop-ink-50 lg:text-[11.5px]">
              {loading ? "loading…" : countLine}
            </span>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMethod(null)}
              className={method === null ? "sop-chip-on" : "sop-chip-off"}
            >
              Any method
            </button>
            {methods.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={method === m ? "sop-chip-on" : "sop-chip-off"}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="border-t border-sop-ink">
            {shown.map((prod) => {
              const unitPrice = isWholesale
                ? prod.wholesale.pricePerKg * prod.wholesale.caseSizeKg
                : prod.retail.price;
              const packLabel = isWholesale
                ? `${prod.wholesale.caseSizeKg} kg case`
                : `${prod.retail.packSizeG} g pack`;
              const perKg = isWholesale
                ? prod.wholesale.pricePerKg
                : Math.round((prod.retail.price / prod.retail.packSizeG) * 1000);

              return (
                <div
                  key={prod._id}
                  className="grid items-start gap-3 border-b border-sop-bone-300 py-4 transition-colors duration-[120ms] hover:bg-sop-blush lg:grid-cols-[1.5fr_1fr_auto] lg:gap-6 lg:py-[18px]"
                >
                  <div>
                    <Link
                      to={`/product/${prod._id}`}
                      className="mb-1.5 block font-semibold text-[15px] leading-[1.25] text-sop-ink hover:text-sop-ember lg:text-[16px]"
                    >
                      {prod.name}
                    </Link>
                    <span className="mb-1.5 block font-plex text-[11px] leading-[1.5] text-sop-ink-50 lg:text-[11.5px]">
                      {packLabel} · {formatINR(perKg)} / kg
                    </span>
                    <span className="block font-plex font-medium text-[10.5px] leading-[1.4] tracking-[.08em] uppercase text-sop-cured">
                      {(prod.methods || []).join(" · ")}
                    </span>
                  </div>

                  <span className="text-[13px] leading-[1.55] text-sop-ink-70 lg:text-[13.5px]">
                    {prod.cutGuide?.whatItIs}
                  </span>

                  <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-end lg:gap-2.5">
                    <span className="whitespace-nowrap font-medium text-[17px] leading-none text-sop-ink lg:text-[18px]">
                      {formatINR(unitPrice)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdd(prod)}
                      className="sop-btn-outline min-h-[44px] px-4 text-[11px]"
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {!loading && shown.length === 0 && (
            <div className="pt-6">
              <span className="block max-w-[46ch] font-plex text-[13px] leading-[1.6] text-sop-ink-50 lg:text-[14px]">
                {method
                  ? alternatives.length > 0
                    ? `Nothing in ${p.name} is worth cooking that way right now. Try ${alternatives
                        .slice(0, 2)
                        .map((k) => primals[k].name)
                        .join(" or ")}, or clear the filter.`
                    : `Nothing on the counter suits ${method.toLowerCase()} today.`
                  : `We aren't carrying ${p.name.toLowerCase()} this week. The guide stays up — the stock moves.`}
              </span>
              <Link to="/catalogue" className="sop-btn-outline mt-4">
                See the whole counter
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* --------------------- temperatures + thawing ------------------- */}
      <section className="grid border-t border-sop-bone-300 bg-sop-ink lg:grid-cols-2">
        <div className="px-4 pb-8 pt-7 lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className="sop-eyebrow mb-3.5 block text-sop-chill lg:mb-4">Temperatures</span>
          <h2 className="mb-3.5 font-display text-[30px] leading-none text-sop-bone-100 lg:mb-4 lg:text-[46px] lg:leading-[.98]">
            Cook to a number,
            <br />
            not to a colour
          </h2>
          <p className="mb-5 max-w-[34ch] text-[13.5px] leading-[1.6] text-sop-ash lg:mb-6 lg:max-w-[42ch] lg:text-[15px]">
            Modern pork is safe and juicy at 63 °C with a rest — faintly pink at the centre is
            correct. Collagen-heavy cuts are the exception: they need to go much further to melt.
          </p>
          <div className="border-t border-sop-ink-70">
            {temps.map((t) => (
              <div
                key={t.k}
                className="flex items-baseline justify-between gap-3.5 border-b border-sop-ink-70 py-3.5 lg:gap-5"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-archivo font-medium text-xs leading-[1.2] tracking-[.1em] uppercase text-sop-bone-100 lg:text-[12.5px]">
                    {t.k}
                  </span>
                  <span className="font-plex text-[10.5px] leading-[1.45] text-sop-ink-40 lg:text-[11.5px]">
                    {t.note}
                  </span>
                </div>
                <span className="flex-none whitespace-nowrap font-plex text-[15px] leading-none text-sop-chill lg:text-[18px]">
                  {t.v}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-sop-ink-70 px-4 pb-8 pt-7 lg:border-l lg:border-t-0 lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className="sop-eyebrow mb-3.5 block text-sop-loin lg:mb-4">Thawing</span>
          <h2 className="mb-5 font-display text-[30px] leading-none text-sop-bone-100 lg:mb-6 lg:text-[46px] lg:leading-[.98]">
            Frozen to ready
          </h2>
          <div className="border-t border-sop-ink-70">
            {thaw.map((t) => (
              <div key={t.k} className="border-b border-sop-ink-70 py-3.5">
                <div className="mb-1.5 flex items-baseline justify-between gap-5">
                  <span className="font-archivo font-medium text-xs leading-[1.2] tracking-[.1em] uppercase text-sop-bone-100 lg:text-[12.5px]">
                    {t.k}
                  </span>
                  <span className="flex-none whitespace-nowrap font-plex text-[14px] leading-none text-sop-chill lg:text-[15px]">
                    {t.v}
                  </span>
                </div>
                <span className="block max-w-[44ch] font-plex text-[11px] leading-[1.5] text-sop-ink-40 lg:text-[11.5px]">
                  {t.note}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/cold-chain"
            className="sop-btn-outline-light mt-5 lg:min-h-[50px] lg:px-6 lg:text-[12.5px]"
          >
            Read the cold chain log
          </Link>
        </div>
      </section>

      {/* -------------------- swaps + cut to spec ----------------------- */}
      <section className="grid border-t border-sop-bone-300 lg:grid-cols-2">
        <div className="border-b border-sop-bone-300 bg-sop-blush px-4 pb-8 pt-7 lg:border-b-0 lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className="sop-eyebrow mb-3.5 block text-sop-rust lg:mb-4">If your recipe says</span>
          <h2 className="mb-5 font-display text-[30px] leading-none text-sop-ink lg:mb-6 lg:text-[46px]">
            Names that don't travel
          </h2>
          <div className="flex flex-col gap-px bg-sop-blush-edge">
            {swaps.map((s) => (
              <div key={s.from} className="bg-sop-blush py-3.5">
                <div className="mb-1.5 flex flex-wrap items-baseline gap-2.5">
                  <span className="font-plex text-xs leading-[1.3] text-sop-rust lg:text-[13px]">
                    {s.from}
                  </span>
                  <span className="font-plex text-xs leading-[1.3] text-sop-cured lg:text-[13px]">
                    →
                  </span>
                  <span className="font-semibold text-[13px] leading-[1.3] text-sop-ink lg:text-[14px]">
                    {s.to}
                  </span>
                </div>
                <span className="block max-w-[46ch] text-[12.5px] leading-[1.55] text-sop-ink-70 lg:text-[13.5px]">
                  {s.why}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-sop-bone-200 px-4 pb-8 pt-7 lg:border-l lg:border-sop-bone-300 lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className="sop-eyebrow mb-3.5 block text-sop-ink-50 lg:mb-4">Cut to spec</span>
          <h2 className="mb-3.5 font-display text-[30px] leading-none text-sop-ink lg:mb-4 lg:text-[46px]">
            Kitchens: name your thickness and trim
          </h2>
          <p className="mb-5 max-w-[34ch] text-[14px] leading-[1.6] text-sop-ink-70 lg:mb-6 lg:max-w-[40ch] lg:text-[15.5px]">
            Every cut on this page can be cut to your spec — chop thickness in millimetres, fat cap
            depth, slice thickness on cold cuts, portion weights held to tolerance. Send a spec, get
            a sample case.
          </p>
          <div className="mb-6 grid grid-cols-2 gap-px border border-sop-bone-300 bg-sop-bone-300">
            {specable.map(([k, v]) => (
              <div key={k} className="bg-sop-bone-100 px-3.5 py-3">
                <span className="mb-1.5 block font-archivo font-semibold text-[9.5px] leading-none tracking-[.16em] uppercase text-sop-ink-50">
                  {k}
                </span>
                <span className="block font-plex text-[12.5px] leading-[1.4] text-sop-ink lg:text-[13px]">
                  {v}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/wholesale" className="sop-btn-ember lg:min-h-[50px] lg:px-6 lg:text-[12.5px]">
              Send a cutting spec
            </Link>
            <Link to="/catalogue" className="sop-btn-outline lg:min-h-[50px] lg:px-6 lg:text-[12.5px]">
              Browse the counter
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CutGuidePage;
