import React from "react";
import { Link } from "react-router";

// The shared spine — both audiences see the same sourcing, cold chain,
// compliance and cut-guide material.
const Footer = () => {
  return (
    <footer className="border-t border-base-content/10 bg-base-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-bold text-primary">Slice of Pink</h3>
          <p className="text-sm text-base-content/60 mt-2">
            A meat wholesaler that sells the paperwork with the product: farm,
            breed, chain, spec.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Shared</h4>
          <ul className="text-sm text-base-content/70 space-y-1">
            <li>
              <Link to="/#sourcing" className="hover:text-primary">
                Sourcing &amp; farms
              </Link>
            </li>
            <li>
              <Link to="/#coldchain" className="hover:text-primary">
                The cold chain
              </Link>
            </li>
            <li>
              <Link to="/#compliance" className="hover:text-primary">
                Quality &amp; compliance
              </Link>
            </li>
            <li>
              <Link to="/#cuts" className="hover:text-primary">
                Cut guides &amp; recipes
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Two doors</h4>
          <ul className="text-sm text-base-content/70 space-y-1">
            <li>
              <Link to="/catalogue" className="hover:text-primary">
                Home cook catalogue
              </Link>
            </li>
            <li>
              <Link to="/wholesale" className="hover:text-primary">
                Trade accounts
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-primary">
                Your orders
              </Link>
            </li>
          </ul>
        </div>

        <div id="contact">
          <h4 className="font-semibold mb-2">Contact</h4>
          <ul className="text-sm text-base-content/70 space-y-1">
            <li>Cold room: Bommasandra, Bengaluru</li>
            <li>Trade desk: trade@sliceofpink.in</li>
            <li>Home orders: hello@sliceofpink.in</li>
            <li>+91 98860 41207</li>
          </ul>
          <p className="text-xs text-base-content/40 mt-3">
            FSSAI 10024xxxxxxxxx · GSTIN 29AAxxxxxxxZ5
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
