import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeftIcon,
  LoaderIcon,
  ShoppingCartIcon,
  FileTextIcon,
  FlameIcon,
  MapPinIcon,
  RulerIcon,
  SnowflakeIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChainBadge from "../components/ChainBadge";
import api from "../lib/axios";
import { formatINR } from "../lib/utils";
import { addToCart } from "../lib/cart";
import { CHAINS } from "../lib/trade";

const Row = ({ label, value }) =>
  value ? (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2 border-b border-base-content/10 last:border-0">
      <span className="text-sm text-base-content/50 w-44 shrink-0">{label}</span>
      <span className="text-sm text-base-content/90">{value}</span>
    </div>
  ) : null;

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [track, setTrack] = useState("retail");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
        setTrack(res.data.track);
        setQuantity(
          res.data.track === "wholesale"
            ? res.data.product.wholesale?.moqCases || 1
            : 1
        );
      } catch (error) {
        console.log("Error in fetching product", error);
        toast.error("Failed to fetch the product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="max-w-2xl mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Link to="/catalogue" className="btn btn-primary mt-4">
            Back to the catalogue
          </Link>
        </div>
      </div>
    );
  }

  const isWholesale = track === "wholesale" && product.wholesale;
  const isPreOrder =
    product.seasonal?.isSeasonal && product.seasonal?.preOrderOpen;

  const unitPrice = isWholesale
    ? product.wholesale.pricePerKg * product.wholesale.caseSizeKg
    : product.retail.price;
  const packLabel = isWholesale
    ? `${product.wholesale.caseSizeKg} kg case`
    : `${product.retail.packSizeG} g pack`;
  const minQty = isWholesale ? product.wholesale.moqCases || 1 : 1;
  const stock = isWholesale
    ? product.wholesale.stockCases
    : product.retail.stockPacks;
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

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/catalogue" className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to the catalogue
          </Link>

          {/* ------------------------- header ------------------------- */}
          <div className="card bg-base-100 mb-6">
            <div className="card-body">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{product.image}</span>
                    <div>
                      <h1 className="text-3xl font-bold">{product.name}</h1>
                      <p className="font-mono text-sm text-base-content/50">
                        {product.sku} · {product.category}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-base-content/70 max-w-xl">
                    {product.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <ChainBadge chain={product.chain} />
                  <p className="text-3xl font-bold text-primary mt-3">
                    {formatINR(unitPrice)}
                  </p>
                  <p className="text-sm text-base-content/60">per {packLabel}</p>
                  {isWholesale && (
                    <p className="text-xs text-base-content/50 mt-1">
                      {formatINR(product.wholesale.pricePerKg)}/kg · MOQ{" "}
                      {product.wholesale.moqCases} · lead time{" "}
                      {product.wholesale.leadTimeDays} days
                    </p>
                  )}
                </div>
              </div>

              {isPreOrder && (
                <div className="alert alert-warning mt-4">
                  <span>
                    Seasonal — {product.seasonal.season}. Pre-order now; it is
                    booked against a confirmed allocation, not held stock.
                  </span>
                </div>
              )}

              {/* --------------------- order box --------------------- */}
              <div className="flex flex-wrap items-end gap-4 mt-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Quantity ({isWholesale ? "cases" : "packs"})
                    </span>
                  </label>
                  <input
                    type="number"
                    min={minQty}
                    className="input input-bordered w-32"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleAdd}
                  disabled={soldOut}
                >
                  <ShoppingCartIcon className="size-5" />
                  {soldOut
                    ? "Out of stock"
                    : isPreOrder
                    ? "Add pre-order"
                    : "Add to order"}
                </button>

                <span className="text-sm text-base-content/60">
                  Line total{" "}
                  <strong className="text-base-content">
                    {formatINR(unitPrice * (quantity || 0))}
                  </strong>
                  {!isPreOrder && (
                    <>
                      {" "}
                      · {stock} {isWholesale ? "case" : "pack"}
                      {stock === 1 ? "" : "s"} available
                    </>
                  )}
                </span>

                {isWholesale && product.spec?.specSheetUrl && (
                  <a
                    href={product.spec.specSheetUrl}
                    className="btn btn-outline btn-sm ml-auto"
                    download
                  >
                    <FileTextIcon className="size-4" />
                    Spec sheet
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ---------------------- cut literacy ---------------------- */}
          <div className="card bg-base-100 mb-6 border-l-4 border-primary">
            <div className="card-body">
              <div className="flex items-center gap-2">
                <FlameIcon className="size-5 text-primary" />
                <h2 className="card-title">Know the cut</h2>
              </div>
              <Row label="What it is" value={product.cutGuide?.whatItIs} />
              <Row
                label="Where on the animal"
                value={product.cutGuide?.whereOnAnimal}
              />
              <Row label="How to cook it" value={product.cutGuide?.cookMethod} />
              <Row label="Temperature" value={product.cutGuide?.cookTemp} />
              <Row label="Timing" value={product.cutGuide?.cookTime} />
              <Row label="Chef's note" value={product.cutGuide?.chefNote} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* ----------------------- cold chain ---------------------- */}
            <div className="card bg-base-100">
              <div className="card-body">
                <div className="flex items-center gap-2">
                  <SnowflakeIcon className="size-5 text-primary" />
                  <h2 className="card-title">Chain &amp; handling</h2>
                </div>
                <Row label="Chain" value={chainMeta?.label} />
                <Row label="Storage" value={product.storageTemp} />
                <Row label="On arrival" value={product.onArrival} />
                <Row
                  label="Thawing"
                  value={
                    product.thawing ||
                    (product.chain === "frozen"
                      ? "Chiller only, never at room temperature."
                      : "Not applicable — this product does not ship frozen.")
                  }
                />
                <Row label="Shelf life" value={product.shelfLife} />
              </div>
            </div>

            {/* ----------------------- provenance ---------------------- */}
            <div className="card bg-base-100">
              <div className="card-body">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="size-5 text-primary" />
                  <h2 className="card-title">Provenance</h2>
                </div>
                <Row label="Farm" value={product.provenance?.farm} />
                <Row label="Breed" value={product.provenance?.breed} />
                <Row label="Feed" value={product.provenance?.feed} />
                <Row label="Origin" value={product.provenance?.origin} />
                <Row label="Grade" value={product.provenance?.grade} />
                <Row label="Catch method" value={product.provenance?.catchMethod} />
                <Row
                  label="Landing region"
                  value={product.provenance?.landingRegion}
                />
              </div>
            </div>

            {/* -------------------------- spec ------------------------- */}
            <div className="card bg-base-100 md:col-span-2">
              <div className="card-body">
                <div className="flex items-center gap-2">
                  <RulerIcon className="size-5 text-primary" />
                  <h2 className="card-title">Spec</h2>
                </div>
                <p className="text-sm text-base-content/60">
                  Hold these numbers to cost a menu against them.
                </p>
                <Row
                  label="Portion weight"
                  value={
                    product.spec?.portionWeightG
                      ? `${product.spec.portionWeightG} g ± ${product.spec.weightTolerancePct}%`
                      : ""
                  }
                />
                <Row
                  label="Cut thickness"
                  value={
                    product.spec?.thicknessMm ? `${product.spec.thicknessMm} mm` : ""
                  }
                />
                <Row
                  label="Slice thickness"
                  value={
                    product.spec?.sliceThicknessMm
                      ? `${product.spec.sliceThicknessMm} mm`
                      : ""
                  }
                />
                <Row
                  label="Retail pack"
                  value={`${product.retail.packSizeG} g`}
                />
                {isWholesale && (
                  <Row
                    label="Case size"
                    value={`${product.wholesale.caseSizeKg} kg`}
                  />
                )}
                {!isWholesale && (
                  <p className="text-xs text-base-content/50 mt-3">
                    Case sizes, rate card and downloadable spec sheets are
                    available on a{" "}
                    <Link to="/wholesale" className="link link-primary">
                      trade account
                    </Link>
                    .
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
