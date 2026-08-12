import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ShoppingCartIcon, PackageIcon, BriefcaseIcon } from "lucide-react";
import { cartCount } from "../lib/cart";
import { getTrack, setTrack, hasWholesaleAccess } from "../lib/account";

const Navbar = () => {
  const [count, setCount] = useState(cartCount());
  const [track, setTrackState] = useState(getTrack());

  const navigate = useNavigate();

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

  return (
    <header className="bg-base-300 border-b border-base-content/10 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
              Slice of Pink
            </h1>
            <span className="hidden md:inline text-xs text-base-content/50 border-l border-base-content/20 pl-2">
              pork · charcuterie · steak · seafood
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* two clearly marked doors, one brand */}
            <div className="join hidden sm:flex">
              <button
                className={`btn btn-sm join-item ${
                  track === "retail" ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => handleTrackSwitch("retail")}
              >
                Home cook
              </button>
              <button
                className={`btn btn-sm join-item ${
                  track === "wholesale" ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() =>
                  hasWholesaleAccess()
                    ? handleTrackSwitch("wholesale")
                    : navigate("/wholesale")
                }
              >
                Trade
              </button>
            </div>

            <Link to="/catalogue" className="btn btn-ghost btn-sm">
              Catalogue
            </Link>

            <Link to="/wholesale" className="btn btn-ghost btn-sm hidden md:inline-flex">
              <BriefcaseIcon className="size-4" />
              Wholesale
            </Link>

            <Link to="/orders" className="btn btn-ghost btn-sm">
              <PackageIcon className="size-4" />
              <span className="hidden sm:inline">Orders</span>
            </Link>

            <Link to="/cart" className="btn btn-primary btn-sm">
              <ShoppingCartIcon className="size-4" />
              <span>{count}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
