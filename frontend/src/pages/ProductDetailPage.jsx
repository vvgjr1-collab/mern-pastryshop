import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hatch from "../components/Hatch";
import NonVegMark from "../components/NonVegMark";
import api from "../lib/axios";
import { formatINR } from "../lib/utils";
import { addToCart } from "../lib/cart";
import { CHAINS } from "../lib/trade";
import { getTrack } from "../lib/account";
import demoProducts from "../lib/demoProducts";

// Every mandatory declaration is a labelled row: caps label left, mono value
// right. A row with no value never renders — the page never shows a spec that
// doesn't apply to what's in the cart.
const Row = ({ k, v }) =>
  v ? (
    <div className="sop-row">
      <span className="sop-key max-w-[46%] flex-none">{k}</span>
      <span className="sop-val">{v}</span>
    </div>
  ) : null;

const SpecGroup = ({ title, note, children }) => (
  <div className="mb-7">
    <h3 className="mb-1 font-display text-[26px] leading-[1.05] text-sop-ink lg:text-[32px]">
      {title}
    </h3>
    {note && <span className="sop-note mb-3 block">{note}</span>}
    <div className="border-t border-sop-ink">{children}</div>
  </div>
);

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [track, setTrack] = useState("retail");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const { id } = useParams();
  const demoMode = searchParams.get("demo") === "true";

  useEffect(() => {
    // a demo line resolves against the local sample SKUs, so the page opens
    // with no API behind it
    const showDemoProduct = () => {
      const demoProduct = demoProducts.find((item) => item._id === id);
      if (!demoProduct) return false;

      const currentTrack = getTrack();
      setProduct(demoProduct);
      setTrack(currentTrack);
      setQuantity(
        currentTrack === "wholesale" ? demoProduct.wholesale?.moqCases || 1 : 1
      );
      return true;
    };

    const fetchProduct = async () => {
      if (demoMode) {
        if (!showDemoProduct()) setProduct(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
        setTrack(res.data.track);
        setQuantity(
          res.data.track === "wholesale" ? res.data.product.wholesale?.moqCases || 1 : 1
        );
      } catch (error) {
        console.log("Error in fetching product", error);
        // fall back to the demo SKU of the same id before giving up
        if (!showDemoProduct()) toast.error("Failed to fetch the product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [demoMode, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-sop-bone-100">
        <Navbar />
        <div className="px-4 py-20 text-center font-plex text-xs text-sop-ink-50">
          loading the cut…
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-sop-bone-100">
        <Navbar />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h2 className="mb-4 font-display text-[30px] leading-none text-sop-ink">
            Product not found
          </h2>
          <Link to="/catalogue" className="sop-btn-outline">
            Back to the catalogue
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isWholesale = track === "wholesale" && product.wholesale;
  const isPreOrder = product.seasonal?.isSeasonal && product.seasonal?.preOrderOpen;

  const unitPrice = isWholesale
    ? product.wholesale.pricePerKg * product.wholesale.caseSizeKg
    : product.retail.price;
  const packLabel = isWholesale
    ? `${product.wholesale.caseSizeKg} kg case`
    : `${product.retail.packSizeG} g pack`;
  const perKg = isWholesale
    ? product.wholesale.pricePerKg
    : Math.round((product.retail.price / product.retail.packSizeG) * 1000);
  const minQty = isWholesale ? product.wholesale.moqCases || 1 : 1;
  const stock = isWholesale ? product.wholesale.stockCases : product.retail.stockPacks;
  const soldOut = !isPreOrder && stock < minQty;

  const chainMeta = CHAINS[product.chain];

  const handleAdd = () => {
    if (quantity < minQty) {
      toast.error(`Minimum order is ${minQty} ${isWholesale ? "case(s)" : "pack(s)"}`);
      return;
    }

    addToCart(
      {
        productId: product._id,
        sku: product.sku,
        name: product.name,
        image: product.image,
        chain: product.chain,
        packLabel,
        unitPrice,
        quantity,
        minQty,
        isPreOrder: !!isPreOrder,
      },
      isWholesale ? "wholesale" : "retail"
    );

    toast.success(`Added ${quantity} × ${packLabel}`);
  };

  const step = (delta) => setQuantity((q) => Math.max(minQty, Math.min(99, q + delta)));

  return (
    <div className="min-h-screen bg-sop-bone-100">
      <Navbar active="Catalogue" />

      {/* breadcrumb */}
      <div className="border-b border-sop-bone-300 px-4 py-3.5 font-plex text-[11px] leading-none text-sop-ink-50 lg:px-8 lg:py-4 lg:text-[11.5px]">
        <Link to="/catalogue" className="hover:text-sop-ink">
          Catalogue
        </Link>{" "}
        · {product.category.replace("-", " ")} · {product.name} · SKU {product.sku}
      </div>

      <div className="grid lg:grid-cols-[1fr_470px]">
        {/* ------------------------- gallery -------------------------- */}
        <div className="border-b border-sop-bone-300 p-4 lg:border-b-0 lg:border-r lg:p-8">
          <Hatch className="mb-2.5 flex h-[380px] flex-col justify-between p-3 lg:h-[600px] lg:p-4">
            <div className="flex items-start justify-between">
              <span className="bg-sop-bone-100 px-2.5 py-2 font-plex font-medium text-[10px] leading-none tracking-[.1em] uppercase text-sop-ink lg:text-[11px]">
                {chainMeta?.label}
              </span>
              <NonVegMark size={26} />
            </div>
            <span className="font-plex text-[10px] leading-[1.5] text-sop-ink-50 lg:text-[11.5px] lg:leading-[1.6]">
              hero cut · single piece, honest colour
              <br />
              top-lit on neutral seamless, no garnish
              <br />
              150 mm steel rule bottom-left for scale
            </span>
          </Hatch>

          <div className="flex gap-2">
            <Hatch className="h-[70px] flex-1 border-[1.5px] border-sop-ink lg:h-[92px]" />
            <Hatch className="flex h-[70px] flex-1 items-end p-1.5 lg:h-[92px]">
              <span className="font-plex text-[9px] leading-[1.3] text-sop-ink-50">
                cut face,
                <br />
                fat bands
              </span>
            </Hatch>
            <Hatch className="flex h-[70px] flex-1 items-end p-1.5 lg:h-[92px]">
              <span className="font-plex text-[9px] leading-[1.3] text-sop-ink-50">
                vacuum pack,
                <br />
                label visible
              </span>
            </Hatch>
            <Hatch
              from="#F7D9D3"
              to="#F3E3DE"
              className="flex h-[70px] flex-1 items-center justify-center p-1.5 text-center lg:h-[92px]"
            >
              <span className="font-plex text-[9px] leading-[1.3] text-sop-rust">
                carcass diagram,
                <br />
                cut highlighted
              </span>
            </Hatch>
          </div>
        </div>

        {/* ------------------------ buy panel -------------------------- */}
        <div className="px-4 pb-8 pt-6 lg:p-8">
          <span className="mb-2.5 block font-archivo font-semibold text-[10px] leading-none tracking-[.18em] uppercase text-sop-cured lg:text-[11px]">
            {product.category.replace("-", " ")} · house cut
          </span>
          <h1 className="mb-3.5 font-display text-[42px] leading-[.95] tracking-[-.02em] text-sop-ink lg:text-[54px] lg:leading-[.94]">
            {product.name}
          </h1>
          <p className="mb-5 text-[14.5px] leading-[1.6] text-sop-ink-70 lg:text-[15px]">
            {product.description}
          </p>

          <div className="mb-5 grid grid-cols-3 gap-px border border-sop-bone-300 bg-sop-bone-300">
            {[
              ["Net", packLabel],
              ["Chain", chainMeta?.label],
              [
                isWholesale ? "MOQ" : "Portion",
                isWholesale
                  ? `${minQty} case${minQty === 1 ? "" : "s"}`
                  : product.spec?.portionWeightG
                  ? `${product.spec.portionWeightG} g`
                  : "—",
              ],
            ].map(([k, v]) => (
              <div key={k} className="bg-sop-bone-100 px-3 py-3">
                <span className="mb-1.5 block font-archivo font-semibold text-[9.5px] leading-none tracking-[.14em] uppercase text-sop-ink-50">
                  {k}
                </span>
                <span className="font-plex text-[14px] leading-none text-sop-ink lg:text-[15px]">
                  {v}
                </span>
              </div>
            ))}
          </div>

          {isPreOrder && (
            <div className="mb-5 border-l-2 border-sop-rust bg-sop-blush p-3.5">
              <span className="mb-1.5 block font-archivo font-semibold text-[10px] leading-none tracking-[.14em] uppercase text-sop-rust">
                Seasonal · {product.seasonal.season}
              </span>
              <span className="block font-plex text-[11.5px] leading-[1.6] text-sop-ink-70">
                Pre-order now. Booked against a confirmed allocation, not held stock.
              </span>
            </div>
          )}

          <div className="mb-3.5 flex items-end justify-between gap-3.5 border border-sop-bone-300 bg-sop-bone-200 p-4">
            <div className="flex flex-col gap-1.5">
              <span className="font-medium text-[32px] leading-none text-sop-ink lg:text-[36px]">
                {formatINR(unitPrice)}
              </span>
              <span className="font-plex text-[11.5px] leading-[1.4] text-sop-ink-50">
                {formatINR(perKg)} / kg · incl. taxes
              </span>
            </div>

            <div className="flex items-center border-[1.5px] border-sop-ink bg-sop-bone-100">
              <button
                type="button"
                onClick={() => step(-1)}
                className="flex h-[46px] w-10 items-center justify-center font-plex text-lg leading-none text-sop-ink"
                aria-label="Fewer"
              >
                −
              </button>
              <span className="w-9 text-center font-plex font-medium text-sm leading-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                className="flex h-[46px] w-10 items-center justify-center font-plex text-lg leading-none text-sop-ink"
                aria-label="More"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={soldOut}
            className="sop-btn-ember mb-2.5 w-full lg:min-h-[52px] lg:text-[12.5px]"
          >
            {soldOut
              ? "Out of stock"
              : `${isPreOrder ? "Pre-order" : "Add to order"} · ${formatINR(
                  unitPrice * quantity
                )}`}
          </button>
          <span className="sop-note mb-5 block">
            {isPreOrder
              ? `Pre-order cut-off ${new Date(
                  product.seasonal.preOrderCutoff
                ).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.`
              : `${stock} ${isWholesale ? "case" : "pack"}${
                  stock === 1 ? "" : "s"
                } available. Cut fresh on the morning of dispatch.`}
          </span>

          {isWholesale && product.spec?.specSheetUrl ? (
            <a href={product.spec.specSheetUrl} download className="sop-btn-outline w-full">
              Download spec sheet
            </a>
          ) : (
            <div className="flex items-center justify-between gap-3.5 bg-sop-blush p-4">
              <div className="flex flex-col gap-1.5">
                <span className="font-archivo font-semibold text-[10px] leading-none tracking-[.16em] uppercase text-sop-rust">
                  Buying for a kitchen?
                </span>
                <span className="font-plex text-xs leading-[1.5] text-sop-ink-70">
                  Case sizes, rate card and a spec sheet per SKU
                </span>
              </div>
              <Link
                to="/wholesale"
                className="whitespace-nowrap border-b-[1.5px] border-sop-ember pb-[3px] font-archivo font-semibold text-[11px] leading-none tracking-[.12em] uppercase text-sop-ink"
              >
                Trade →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------- the specs --------------------------- */}
      <div className="border-t border-sop-bone-300 bg-sop-bone-200 px-4 pb-4 pt-8 lg:px-8 lg:pt-11">
        <div className="grid gap-x-11 lg:grid-cols-2">
          <SpecGroup title="The cut" note="Where it sits on the animal and what that means.">
            <Row k="What it is" v={product.cutGuide?.whatItIs} />
            <Row k="Where on the animal" v={product.cutGuide?.whereOnAnimal} />
            <Row k="Best for" v={product.cutGuide?.cookMethod} />
            <Row k="Chef's note" v={product.cutGuide?.chefNote} />
          </SpecGroup>

          <SpecGroup title="How to cook it" note="Pull at core temperature, not at the clock.">
            <Row k="Method" v={product.cutGuide?.cookMethod} />
            <Row k="Temperature" v={product.cutGuide?.cookTemp} />
            <Row k="Timing" v={product.cutGuide?.cookTime} />
          </SpecGroup>

          <SpecGroup title="Spec" note="Hold these numbers to cost a menu against them.">
            <Row
              k="Portion weight"
              v={
                product.spec?.portionWeightG
                  ? `${product.spec.portionWeightG} g ± ${product.spec.weightTolerancePct}%`
                  : ""
              }
            />
            <Row
              k="Cut thickness"
              v={product.spec?.thicknessMm ? `${product.spec.thicknessMm} mm` : ""}
            />
            <Row
              k="Slice thickness"
              v={product.spec?.sliceThicknessMm ? `${product.spec.sliceThicknessMm} mm` : ""}
            />
            <Row k="Retail pack" v={`${product.retail.packSizeG} g`} />
            {isWholesale && <Row k="Case size" v={`${product.wholesale.caseSizeKg} kg`} />}
            {isWholesale && (
              <Row k="Lead time" v={`${product.wholesale.leadTimeDays} days`} />
            )}
          </SpecGroup>

          <SpecGroup
            title="Storage & handling"
            note={
              product.chain === "frozen"
                ? "Frozen pack — thaw once, in the chiller."
                : product.chain === "ambient-cured"
                ? "Ready to eat — there is no kill step left."
                : "Chilled pack — never refrozen by us."
            }
          >
            <Row k="Chain" v={chainMeta?.label} />
            <Row k="Store at" v={product.storageTemp} />
            <Row k="On arrival" v={product.onArrival} />
            <Row k="Thawing" v={product.thawing} />
            <Row k="Shelf life" v={product.shelfLife} />
          </SpecGroup>

          <SpecGroup title="Origin & traceability" note="Every pack walks back to a barn.">
            <Row k="Farm" v={product.provenance?.farm} />
            <Row k="Breed" v={product.provenance?.breed} />
            <Row k="Feed" v={product.provenance?.feed} />
            <Row k="Origin" v={product.provenance?.origin} />
            <Row k="Grade" v={product.provenance?.grade} />
            <Row k="Catch method" v={product.provenance?.catchMethod} />
            <Row k="Landing region" v={product.provenance?.landingRegion} />
          </SpecGroup>

          {!isWholesale && (
            <div className="mb-7">
              <h3 className="mb-1 font-display text-[26px] leading-[1.05] text-sop-ink lg:text-[32px]">
                Case quantities
              </h3>
              <span className="sop-note mb-3 block">
                The same SKU, in kitchen sizes.
              </span>
              <p className="mb-4 max-w-[40ch] text-[14px] leading-[1.6] text-sop-ink-70">
                Case size, MOQ, lead time and the downloadable spec sheet for this cut are released
                with an approved trade account. Wholesale rates are never shown on the open site.
              </p>
              <Link to="/wholesale" className="sop-btn-outline">
                Open a trade account
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ----------------------- declarations -------------------------- */}
      <div className="grid items-start gap-7 bg-sop-ink px-4 py-8 lg:grid-cols-[auto_1fr] lg:px-8 lg:py-11">
        <div className="flex flex-col gap-3">
          <span className="sop-eyebrow text-sop-loin">Declarations</span>
          <NonVegMark size={40} tone="#EFB2A8" bg="#221E1C" />
          <span className="max-w-[26ch] font-plex text-xs leading-[1.6] text-sop-ash">
            Non-vegetarian. Single ingredient. No added water, no brine injection. Facility also
            handles fish and soy.
          </span>
        </div>

        <div className="grid gap-x-9 lg:grid-cols-2">
          {[
            ["FSSAI licence", "10021064000000"],
            ["Veg / non-veg", "Non-vegetarian"],
            ["Net quantity", packLabel],
            ["Lot code", `SP-${product.sku.split("-").pop()}-B14`],
            ["Packer", "Slice of Pink Foods Pvt Ltd, Taloja, Maharashtra"],
            ["Consumer care", "hello@sliceofpink.in · +91 98217 00016"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between gap-4 border-b border-sop-ink-70 py-2.5"
            >
              <span className="font-archivo font-semibold text-[10.5px] leading-[1.4] tracking-[.12em] uppercase text-sop-ink-40">
                {k}
              </span>
              <span className="text-right font-plex text-[12.5px] leading-[1.4] text-sop-bone-100">
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
