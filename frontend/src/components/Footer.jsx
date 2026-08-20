import React from "react";
import { Link } from "react-router";

// The shared spine — both audiences see the same sourcing, cold chain,
// compliance and cut-guide material.
const columns = [
  {
    head: "Shop",
    items: [
      { label: "Catalogue", to: "/catalogue" },
      { label: "Pork", to: "/catalogue?category=pork" },
      { label: "Charcuterie", to: "/catalogue?category=cold-cuts" },
      { label: "Steak", to: "/catalogue?category=steak" },
      { label: "Seafood", to: "/catalogue?category=seafood" },
    ],
  },
  {
    head: "Trade",
    items: [
      { label: "Wholesale", to: "/wholesale" },
      { label: "Rate card", to: "/wholesale" },
      { label: "Case sizes", to: "/wholesale" },
      { label: "Spec sheets", to: "/wholesale" },
      { label: "Credit terms", to: "/wholesale" },
    ],
  },
  {
    head: "Learn",
    items: [
      { label: "Cut guide", to: "/cut-guide" },
      { label: "Canada story", to: "/canada-story" },
      { label: "Cold chain", to: "/cold-chain" },
      { label: "About us", to: "/about" },
    ],
  },
  {
    head: "Care",
    items: [
      { label: "Your orders", to: "/orders" },
      { label: "Delivery areas", to: "/about#contact" },
      { label: "Quality & compliance", to: "/#compliance" },
      { label: "Contact", to: "/about#contact" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-sop-bone-300 bg-sop-bone-100 px-4 pb-24 pt-[26px] lg:grid lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-8 lg:px-8 lg:pb-10 lg:pt-12">
      <div>
        <span className="mb-4 block font-display text-2xl leading-none text-sop-ink lg:mb-3 lg:text-[34px]">
          Slice of Pink
        </span>
        <span className="hidden max-w-[26ch] font-plex text-xs leading-[1.7] text-sop-ink-50 lg:block">
          FSSAI 10021064000000
          <br />
          GSTIN 29ABCDE1234F1Z5
          <br />
          Contains non-vegetarian products.
        </span>
      </div>

      <div className="mb-[22px] grid grid-cols-2 gap-x-3 gap-y-[18px] lg:contents">
        {columns.map((col) => (
          <div key={col.head} className="flex flex-col gap-[7px] lg:gap-[9px]">
            <span className="font-archivo font-semibold text-[10px] lg:text-[10.5px] leading-none tracking-[.16em] uppercase text-sop-ink-50">
              {col.head}
            </span>
            {col.items.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="font-archivo text-[12.5px] leading-[1.5] text-sop-ink-70 hover:text-sop-ember lg:text-[13px]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div id="contact" className="flex flex-col gap-[7px] border-t border-sop-bone-300 pt-3.5 lg:hidden">
        <span className="font-plex text-[11px] leading-[1.6] text-sop-ink-50">
          Cold room: Taloja, Maharashtra · trade@sliceofpink.in · +91 98217 00016
        </span>
        <span className="font-plex text-[11px] leading-[1.6] text-sop-ink-50">
          FSSAI licence 10021064000000 · GSTIN 29ABCDE1234F1Z5
        </span>
        <span className="font-plex text-[11px] leading-[1.6] text-sop-ink-50">
          Contains non-vegetarian products. Store as marked.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
