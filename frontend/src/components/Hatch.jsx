import React from "react";

// Every image slot ships with its brief written into it, so shoots can be
// commissioned straight off the design. Bone hatch by default, blush hatch for
// pink surfaces.
const Hatch = ({ className = "", from = "#EFE7DA", to = "#F3EDE4", children }) => (
  <div
    className={className}
    style={{
      background: `repeating-linear-gradient(45deg, ${from} 0 10px, ${to} 10px 20px)`,
    }}
  >
    {children}
  </div>
);

export default Hatch;
