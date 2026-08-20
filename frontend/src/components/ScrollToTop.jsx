import { useEffect } from "react";
import { useLocation } from "react-router";

// A single-page app keeps the scroll position across navigations, so opening a
// product from halfway down the catalogue drops you halfway down the product.
// Reset on every route change, and honour #anchors from the footer links.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
