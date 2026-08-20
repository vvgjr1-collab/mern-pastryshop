import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { cartSubtotal } from "../lib/cart";
import { formatINR } from "../lib/utils";

// WhatsApp is a real bar item, docked in the sticky footer bar on mobile —
// not a floating bubble. Desktop keeps the header CTA instead.
const StickyBar = () => {
  const [total, setTotal] = useState(cartSubtotal());

  useEffect(() => {
    const sync = () => setTotal(cartSubtotal());
    window.addEventListener("cart:updated", sync);
    return () => window.removeEventListener("cart:updated", sync);
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex gap-px border-t border-sop-ink bg-sop-ink-70 lg:hidden">
      <a
        href="https://wa.me/919821700016"
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-2.5 bg-sop-ink font-archivo font-semibold text-xs leading-none tracking-[.1em] uppercase text-sop-bone-100"
      >
        <span className="h-2 w-2 bg-sop-loin" />
        Order on WhatsApp
      </a>
      <Link
        to="/cart"
        className="inline-flex min-h-[56px] flex-none items-center justify-center bg-sop-ember px-[18px] font-archivo font-semibold text-xs leading-none tracking-[.1em] uppercase text-sop-bone-100"
      >
        Cart · {formatINR(total)}
      </Link>
    </div>
  );
};

export default StickyBar;
