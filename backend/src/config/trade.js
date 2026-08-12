// Trading rules for both doors. Kept in one place so the API and the storefront
// can never drift apart on what a valid order looks like.

export const RETAIL = {
  minCartValue: 800, // INR
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
  minOrderValue: 10000, // INR, per drop
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
    risk: "Shortest window. Breaks show up as drip loss and off-smell.",
  },
  frozen: {
    label: "Frozen",
    temp: "-18 °C or below",
    risk: "Refreezing is the failure mode. Thaw once, in the chiller.",
  },
  "ambient-cured": {
    label: "Ready-to-eat cured",
    temp: "12 to 18 °C ambient, 4 °C once sliced",
    risk: "Ready to eat means no kill step left. Cross-contact is the risk.",
  },
};
