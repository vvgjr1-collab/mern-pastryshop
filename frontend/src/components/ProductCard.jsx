import { Link } from "react-router";
import toast from "react-hot-toast";
import { formatINR } from "../lib/utils";
import { addToCart } from "../lib/cart";
import { CHAINS } from "../lib/trade";
import Hatch from "./Hatch";
import NonVegMark from "./NonVegMark";

const ProductCard = ({ product, track }) => {
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

  const stock = isWholesale ? product.wholesale.stockCases : product.retail.stockPacks;
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

    toast.success(`${product.name} · ${minQty} × ${packLabel}`);
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="flex flex-col border border-sop-bone-300 bg-sop-bone-100 transition-colors duration-[120ms] hover:border-sop-ink"
    >
      <Hatch className="flex h-[150px] items-start justify-between p-2.5 lg:h-[190px]">
        <span className="bg-sop-bone-100 px-2 py-1.5 font-plex font-medium text-[9.5px] leading-none tracking-[.08em] uppercase text-sop-ink">
          {CHAINS[product.chain]?.label || product.chain}
        </span>
        <NonVegMark />
      </Hatch>

      <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3.5 lg:px-4 lg:pb-[17px] lg:pt-4">
        <span className="mb-2 block font-archivo font-semibold text-[9.5px] leading-none tracking-[.16em] uppercase text-sop-cured">
          {product.category.replace("-", " ")}
          {isPreOrder && ` · pre-order`}
        </span>

        <span className="mb-1.5 block font-display text-[21px] leading-[1.05] text-sop-ink lg:text-[25px]">
          {product.name}
        </span>

        <span className="mb-2 block font-plex text-[10.5px] leading-[1.5] text-sop-ink-50 lg:text-[11px]">
          {product.sku} · {packLabel}
        </span>

        <span className="mb-3 block text-[12.5px] leading-[1.55] text-sop-ink-70 line-clamp-2">
          {product.cutGuide?.whatItIs || product.description}
        </span>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-sop-bone-300 pt-3">
          <div>
            <span className="block font-medium text-[17px] leading-none text-sop-ink">
              {formatINR(unitPrice)}
            </span>
            <span className="mt-1.5 block font-plex text-[10.5px] leading-none text-sop-ink-50">
              {formatINR(perKg)} / kg
              {isWholesale && ` · MOQ ${minQty}`}
            </span>
            <span
              className={`mt-1.5 block font-plex text-[10px] leading-none ${
                soldOut ? "text-sop-cured" : "text-sop-ink-50"
              }`}
            >
              {isPreOrder
                ? "Pre-order open"
                : soldOut
                ? "Out of stock"
                : `${stock} ${isWholesale ? "case" : "pack"}${stock === 1 ? "" : "s"} in stock`}
            </span>
          </div>

          <button
            type="button"
            className="sop-btn-outline min-h-[44px] px-4 text-[10.5px] disabled:border-sop-bone-400 disabled:text-sop-ink-40 disabled:hover:bg-transparent disabled:hover:text-sop-ink-40"
            onClick={handleAdd}
            disabled={soldOut}
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
