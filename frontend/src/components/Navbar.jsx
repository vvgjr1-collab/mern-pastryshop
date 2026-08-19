import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { cartCount } from "../lib/cart";
import { getTrack, setTrack, hasWholesaleAccess } from "../lib/account";

const learnNav = [
  { label: "Catalogue", to: "/catalogue" },
  { label: "Cut guide", to: "/cut-guide" },
  { label: "Cold chain", to: "/cold-chain" },
  { label: "Canada story", to: "/canada-story" },
  { label: "Wholesale", to: "/wholesale" },
];

// One brand, two clearly marked doors. Trade inverts to charcoal so a buyer
// always knows which side of the house they are on.
const Navbar = ({ inverted = false, active = "" }) => {
  const [count, setCount] = useState(cartCount());
  const [track, setTrackState] = useState(getTrack());

  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const sync = () => {
      setCount(cartCount());
      setTrackState(getTrack());
    };

    window.addEventListener("cart:updated", sync);
    window.addEventListener("account:updated", sync);
    return () => {
      window.removeEventListener("cart:updated", sync);
      window.removeEventListener("account:updated", sync);
    };
  }, []);

  const handleTrackSwitch = (next) => {
    setTrackState(setTrack(next));
    navigate("/catalogue");
  };

  const surface = inverted ? "bg-sop-ink" : "bg-sop-bone-100";
  const rule = inverted ? "border-sop-ink-70" : "border-sop-bone-300";
  const brandInk = inverted ? "text-sop-bone-100" : "text-sop-ink";
  const linkInk = inverted
    ? "text-sop-ash hover:text-sop-bone-100"
    : "text-sop-ink-70 hover:text-sop-ink";

  return (
    <header className="sticky top-0 z-50">
      {/* utility bar */}
      <div
        className={`flex items-center justify-between gap-4 px-4 py-2 lg:px-8 lg:py-[9px] ${
          inverted ? "bg-black" : "bg-sop-ink"
        }`}
      >
        <span className="font-plex text-[11px] lg:text-[11.5px] leading-none tracking-[.06em] text-sop-loin">
          <span className="lg:hidden">Bengaluru · next-day chilled</span>
          <span className="hidden lg:inline">
            Bengaluru · Mumbai · next-day chilled · order by 6 am for same-day trade dispatch
          </span>
        </span>
        <span className="whitespace-nowrap font-plex font-medium text-[11px] lg:text-[11.5px] leading-none tracking-[.06em] text-sop-bone-100">
          FSSAI 10021064000000
        </span>
      </div>

      {/* brand + navigation */}
      <div className={`flex items-center justify-between gap-3 border-b px-4 py-3.5 lg:px-8 lg:py-5 ${surface} ${rule}`}>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className={`font-display text-[25px] lg:text-[32px] leading-none tracking-[-.01em] ${brandInk}`}
          >
            Slice of Pink
          </Link>
          {inverted && (
            <span className="hidden bg-sop-loin px-2.5 py-[7px] font-plex font-medium text-[10px] leading-none tracking-[.1em] uppercase text-sop-ink sm:inline-flex">
              Wholesale
            </span>
          )}
        </div>

        <nav className="flex items-center gap-3.5 lg:gap-[22px]">
          {learnNav.slice(1, 4).map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`hidden font-plex text-xs leading-none lg:inline ${
                active === item.label
                  ? `border-b-[1.5px] border-sop-ember pb-0.5 font-medium ${brandInk}`
                  : linkInk
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* two doors */}
          <div className="hidden items-center border-[1.5px] border-sop-ink sm:inline-flex">
            <button
              type="button"
              onClick={() => handleTrackSwitch("retail")}
              className={`px-3 py-2 font-archivo font-semibold text-[10.5px] leading-none tracking-[.12em] uppercase ${
                track === "retail" ? "bg-sop-ink text-sop-bone-100" : "bg-sop-bone-100 text-sop-ink"
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() =>
                hasWholesaleAccess() ? handleTrackSwitch("wholesale") : navigate("/wholesale")
              }
              className={`px-3 py-2 font-archivo font-semibold text-[10.5px] leading-none tracking-[.12em] uppercase ${
                track === "wholesale" ? "bg-sop-ink text-sop-bone-100" : "bg-sop-bone-100 text-sop-ink"
              }`}
            >
              Trade
            </button>
          </div>

          <Link
            to="/orders"
            className={`font-plex text-[11px] leading-none lg:text-xs ${linkInk}`}
          >
            Orders
          </Link>

          <Link
            to="/cart"
            className={`inline-flex items-center gap-1.5 font-plex font-medium text-[11px] leading-none lg:gap-[7px] lg:text-xs ${brandInk}`}
          >
            Cart
            <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center bg-sop-loin text-[10px] text-sop-ink lg:h-[19px] lg:min-w-[19px]">
              {count}
            </span>
          </Link>

          {pathname !== "/wholesale" && (
            <Link
              to="/wholesale"
              className="hidden min-h-[44px] items-center bg-sop-ember px-[18px] font-archivo font-semibold text-[11.5px] leading-none tracking-[.12em] uppercase text-sop-bone-100 hover:bg-sop-ember-dark lg:inline-flex"
            >
              Wholesale
            </Link>
          )}
        </nav>
      </div>

      {/* tab strip — the learn spine, scrollable on mobile */}
      <div className={`flex overflow-x-auto border-b ${rule} ${surface} lg:hidden`}>
        {learnNav.map((item) => {
          const on = item.label === active;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex-none whitespace-nowrap border-r px-3.5 py-[13px] font-archivo text-[11px] leading-none tracking-[.12em] uppercase ${
                inverted ? "border-sop-ink-70" : "border-sop-bone-200"
              } ${
                on
                  ? "bg-sop-blush font-semibold text-sop-ink"
                  : `font-medium ${inverted ? "text-sop-ash" : "text-sop-ink-70"}`
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
};

export default Navbar;
