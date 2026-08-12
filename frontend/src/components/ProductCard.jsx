import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import toast from "react-hot-toast";
import { formatINR } from "../lib/utils";
import { addToCart } from "../lib/cart";
import ChainBadge from "./ChainBadge";

const ProductCard = ({ product, track, demoMode = false }) => {
  const isWholesale = track === "wholesale" && product.wholesale;
  const isPreOrder =
    product.seasonal?.isSeasonal && product.seasonal?.preOrderOpen;

  const unitPrice = isWholesale
    ? product.wholesale.pricePerKg * product.wholesale.caseSizeKg
    : product.retail.price;

  const packLabel = isWholesale
    ? `${product.wholesale.caseSizeKg} kg case`
    : `${product.retail.packSizeG} g pack`;

  const stock = isWholesale
    ? product.wholesale.stockCases
    : product.retail.stockPacks;

  const minQty = isWholesale ? product.wholesale.moqCases || 1 : 1;
  const soldOut = !isPreOrder && stock < minQty;

  const handleAdd = (e) => {
    e.preventDefault(); // don't follow the card link

    addToCart(
      {
        productId: product._id,
        sku: product.sku,
        name: product.name,
        image: product.image,
        chain: product.chain,
        packLabel,
        unitPrice,
        quantity: minQty,
        minQty,
        isPreOrder: !!isPreOrder,
      },
      isWholesale ? "wholesale" : "retail"
    );

    toast.success(`${product.name} added — ${minQty} × ${packLabel}`);
  };

  return (
    <Link
      to={
        demoMode
          ? `/product/${product._id}?demo=true`
          : `/product/${product._id}`
      }
      className="card bg-base-100 hover:shadow-lg transition-all duration-200
      border-t-4 border-solid border-primary"
    >
      <div className="card-body">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="card-title text-base-content">
              <span className="text-2xl">{product.image}</span>
              {product.name}
            </h3>
            <p className="text-xs font-mono text-base-content/50 mt-1">
              {product.sku}
            </p>
          </div>
          <ChainBadge chain={product.chain} />
        </div>

        {/* provenance — the differentiator against someone who just moves boxes */}
        <p className="text-sm text-base-content/70 line-clamp-2 mt-1">
          {product.provenance?.farm || product.provenance?.origin}
          {product.provenance?.breed && ` · ${product.provenance.breed}`}
          {product.provenance?.grade && ` · ${product.provenance.grade}`}
          {product.provenance?.catchMethod &&
            ` · ${product.provenance.catchMethod}`}
        </p>

        {/* cut literacy, in one line, before they even open the page */}
        <p className="text-sm text-base-content/60 line-clamp-2 italic">
          {product.cutGuide?.whatItIs}
        </p>

        <div className="flex flex-wrap gap-1 mt-2">
          {product.spec?.portionWeightG && (
            <span className="badge badge-ghost badge-sm">
              {product.spec.portionWeightG} g ±{product.spec.weightTolerancePct}
              %
            </span>
          )}
          {product.spec?.thicknessMm && (
            <span className="badge badge-ghost badge-sm">
              {product.spec.thicknessMm} mm cut
            </span>
          )}
          {product.spec?.sliceThicknessMm && (
            <span className="badge badge-ghost badge-sm">
              {product.spec.sliceThicknessMm} mm slice
            </span>
          )}
          {isPreOrder && (
            <span className="badge badge-warning badge-sm">
              Pre-order · {product.seasonal.season}
            </span>
          )}
        </div>

        <div className="card-actions justify-between items-end mt-4">
          <div>
            <p className="text-lg font-bold text-primary">
              {formatINR(unitPrice)}
              <span className="text-xs font-normal text-base-content/60">
                {" "}
                / {packLabel}
              </span>
            </p>
            {isWholesale ? (
              <p className="text-xs text-base-content/50">
                {formatINR(product.wholesale.pricePerKg)}/kg · MOQ{" "}
                {product.wholesale.moqCases} case
                {product.wholesale.moqCases > 1 ? "s" : ""}
              </p>
            ) : (
              <p className="text-xs text-base-content/50">
                {formatINR(
                  Math.round(
                    (product.retail.price / product.retail.packSizeG) * 1000
                  )
                )}
                /kg
              </p>
            )}
            <p
              className={`text-xs mt-1 ${
                soldOut ? "text-error" : "text-success"
              }`}
            >
              {isPreOrder
                ? "Pre-order open"
                : soldOut
                ? "Out of stock"
                : `${stock} ${isWholesale ? "case" : "pack"}${
                    stock === 1 ? "" : "s"
                  } in stock`}
            </p>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleAdd}
            disabled={soldOut}
          >
            <PlusIcon className="size-4" />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
