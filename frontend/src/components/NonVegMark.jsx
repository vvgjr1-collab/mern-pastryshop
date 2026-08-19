import React from "react";

// Fixed by FSSAI, not ours to restyle. Appears on every product card and PDP.
const NonVegMark = ({ size = 20, tone = "#7A3A16", bg = "#FBF7F1" }) => (
  <span
    className="inline-flex flex-none items-center justify-center"
    style={{ width: size, height: size, border: `1.5px solid ${tone}`, background: bg }}
    title="Non-vegetarian"
    aria-label="Non-vegetarian"
  >
    <span
      style={{
        width: 0,
        height: 0,
        borderLeft: `${size * 0.22}px solid transparent`,
        borderRight: `${size * 0.22}px solid transparent`,
        borderBottom: `${size * 0.4}px solid ${tone}`,
      }}
    />
  </span>
);

export default NonVegMark;
