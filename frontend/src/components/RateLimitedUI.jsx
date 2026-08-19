import React from "react";

const RateLimitedUI = () => {
  return (
    <div className="border-b border-sop-bone-300 bg-sop-blush px-4 py-5 lg:px-11">
      <span className="sop-eyebrow mb-2 block text-sop-rust">Rate limit reached</span>
      <p className="max-w-[60ch] text-[14px] leading-[1.6] text-sop-ink-70">
        Too many requests to the catalogue in a short period. Wait a moment and try again.
      </p>
      <p className="mt-2 font-plex text-[11.5px] leading-[1.6] text-sop-rust">
        Trade buyers placing a large order: the desk will take it on WhatsApp — +91 98860 41207.
      </p>
    </div>
  );
};

export default RateLimitedUI;
