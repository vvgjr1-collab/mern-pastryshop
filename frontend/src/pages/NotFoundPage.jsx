import React from "react";
import { Link, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Anything that isn't a route used to render a blank page with no way back.
const NotFoundPage = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-sop-bone-100">
      <Navbar />

      <section className="mx-auto max-w-2xl px-4 pb-16 pt-12 lg:px-8 lg:pt-20">
        <span className="sop-eyebrow mb-3.5 block text-sop-cured">404 · not on the shelf</span>
        <h1 className="mb-4 font-display text-[42px] leading-[.95] tracking-[-.015em] text-sop-ink lg:text-[64px] lg:leading-[.9]">
          That page isn't in the cold room
        </h1>
        <p className="mb-2 max-w-[46ch] text-[15px] leading-[1.6] text-sop-ink-70 lg:text-[17px]">
          Nothing answers to{" "}
          <span className="font-plex text-[13px] text-sop-ink">{pathname}</span>. It may have been
          renamed, or the link that sent you here is out of date.
        </p>
        <p className="sop-note mb-7">
          If you were following a lot code or a spec sheet link, the trade desk can find it for you.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link to="/catalogue" className="sop-btn-ember">
            Shop the counter
          </Link>
          <Link to="/" className="sop-btn-outline">
            Back to the front
          </Link>
        </div>

        <div className="mt-10 border-t border-sop-ink pt-6">
          <span className="sop-eyebrow mb-3.5 block text-sop-ink-50">Or pick up the thread</span>
          <div className="grid gap-px bg-sop-bone-300 sm:grid-cols-3">
            {[
              { to: "/cut-guide", head: "Cut guide", body: "What the cut is and how to cook it" },
              { to: "/cold-chain", head: "Cold chain", body: "The lot log, probe by probe" },
              { to: "/canada-story", head: "Canada story", body: "Where the meat comes from" },
            ].map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="bg-sop-bone-100 p-4 transition-colors duration-[120ms] hover:bg-sop-blush"
              >
                <span className="mb-1.5 block font-display text-[22px] leading-none text-sop-ink">
                  {card.head}
                </span>
                <span className="block font-plex text-[11px] leading-[1.5] text-sop-ink-50">
                  {card.body}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
