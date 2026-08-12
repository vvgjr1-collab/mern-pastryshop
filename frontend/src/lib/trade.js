// Mirrors backend/src/config/trade.js so the storefront can show the rules
// before it submits. The server is still the one that enforces them.

export const RETAIL = {
  minCartValue: 800,
  deliveryFee: 79,
  freeDeliveryOver: 2500,
  slots: [
    "Tomorrow 07:00 – 10:00",
    "Tomorrow 11:00 – 14:00",
    "Tomorrow 17:00 – 20:00",
    "Saturday 07:00 – 10:00",
    "Saturday 17:00 – 20:00",
  ],
};

export const WHOLESALE = {
  minOrderValue: 10000,
  orderCutOff: "18:00 the day before dispatch",
  windows: [
    "Mon / Wed / Fri — 05:00 – 08:00",
    "Tue / Thu / Sat — 05:00 – 08:00",
    "Daily — 05:00 – 08:00 (standing order)",
  ],
};

export const CHAINS = {
  chilled: {
    label: "Fresh chilled",
    temp: "0 to 4 °C",
    badge: "badge-info",
    risk: "Shortest window. A break shows up as drip loss and off-smell.",
    onArrival: "Into the chiller within 15 minutes of the box landing.",
  },
  frozen: {
    label: "Frozen",
    temp: "-18 °C or below",
    badge: "badge-primary",
    risk: "Refreezing is the failure mode. Thaw once, in the chiller.",
    onArrival: "Straight to the freezer. Soft edges mean it thawed in transit.",
  },
  "ambient-cured": {
    label: "Ready-to-eat cured",
    temp: "12 to 18 °C, 4 °C once sliced",
    badge: "badge-secondary",
    risk: "Ready to eat means no kill step left. Cross-contact is the risk.",
    onArrival: "Store away from raw meat. Dedicated boards and slicer.",
  },
};

export const CATEGORIES = [
  { value: "all", label: "Everything" },
  { value: "pork", label: "Pork" },
  { value: "cold-cuts", label: "Cold cuts" },
  { value: "steak", label: "Steak" },
  { value: "seafood", label: "Seafood" },
  { value: "poultry", label: "Poultry" },
];

// Principle 6: the calendar exists so November is not a scramble.
export const SEASONAL_CALENDAR = [
  { month: "Aug – Sep", note: "Turkey flock allocation confirmed with the farm" },
  { month: "Oct 1", note: "Christmas turkey and duck pre-orders open" },
  { month: "Nov 30", note: "Pre-order cut-off — after this we sell what is left" },
  { month: "Dec 18 – 24", note: "Christmas delivery windows, wholesale first" },
];
