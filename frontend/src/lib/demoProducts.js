const demoProducts = [
  {
    _id: "demo-belly",
    primal: "belly",
    methods: ["Roast", "Braise", "Cure"],
    name: "Berkshire Pork Belly, Skin-On",
    sku: "SOP-PRK-101",
    category: "pork",
    image: "🥓",
    description:
      "Whole-slab belly from Berkshire pigs, skin on, ribs off. Built for crackling.",
    chain: "chilled",
    provenance: {
      farm: "Maple Ridge · EST 243",
      breed: "Berkshire",
      origin: "British Columbia, Canada",
      grade: "Canada 2",
    },
    cutGuide: {
      whatItIs:
        "The fatty underside of the pig, layered fat and meat in bands — the cut bacon and pancetta are made from.",
    },
    spec: {
      portionWeightG: 1000,
      weightTolerancePct: 5,
    },
    retail: { packSizeG: 500, price: 549, stockPacks: 24, subscribable: false },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 720,
      moqCases: 2,
      leadTimeDays: 2,
      stockCases: 12,
    },
    seasonal: { isSeasonal: false, season: "", preOrderOpen: false },
  },
  {
    _id: "demo-coppa",
    primal: "shoulder",
    methods: ["Cure"],
    name: "Coppa (Capocollo), Whole Muscle",
    sku: "SOP-CUT-301",
    category: "cold-cuts",
    image: "🍑",
    description:
      "Whole pork neck, salt-cured with black pepper and fennel, air-dried 90 days.",
    chain: "ambient-cured",
    provenance: {
      farm: "Red Deer · EST 306",
      breed: "Berkshire",
      origin: "Neck from EST 306, cured in Bengaluru",
      grade: "Canada 2",
    },
    cutGuide: {
      whatItIs:
        "Cured pork neck — fattier and sweeter than prosciutto, meant to be sliced paper-thin.",
    },
    spec: {
      portionWeightG: 1500,
      weightTolerancePct: 10,
      sliceThicknessMm: 1.5,
    },
    retail: { packSizeG: 200, price: 899, stockPacks: 16, subscribable: false },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 3200,
      moqCases: 1,
      leadTimeDays: 4,
      stockCases: 5,
    },
    seasonal: { isSeasonal: false, season: "", preOrderOpen: false },
  },
  {
    _id: "demo-salmon",
    primal: "",
    methods: ["Fry", "Roast"],
    name: "Atlantic Salmon Fillet, Skin-On",
    sku: "SOP-FSH-401",
    category: "seafood",
    image: "🐟",
    description:
      "Trimmed center-cut fillet with skin on. Chilled, portioned, and ready for service.",
    chain: "chilled",
    provenance: {
      origin: "New Brunswick, Canada",
      catchMethod: "Farmed, ASC certified",
      landingRegion: "Bay of Fundy",
      grade: "Superior, Trim D",
    },
    cutGuide: {
      whatItIs:
        "A premium fish fillet with enough fat to roast, grill, or cure without drying out.",
    },
    spec: {
      portionWeightG: 220,
      weightTolerancePct: 5,
      thicknessMm: 28,
    },
    retail: { packSizeG: 440, price: 799, stockPacks: 18, subscribable: false },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 1480,
      moqCases: 1,
      leadTimeDays: 2,
      stockCases: 8,
    },
    seasonal: { isSeasonal: false, season: "", preOrderOpen: false },
  },
  {
    _id: "demo-steak",
    primal: "",
    methods: ["Grill", "Fry"],
    name: "Striploin Steak, Canada AAA, 22 mm",
    sku: "SOP-BEF-201",
    category: "steak",
    image: "🥩",
    description:
      "Centre-cut steak with a fixed 22 mm thickness. Quick sear, good marbling, clean spec.",
    chain: "frozen",
    provenance: {
      origin: "Alberta, Canada",
      breed: "Angus",
      grade: "Canada AAA",
    },
    cutGuide: {
      whatItIs:
        "A steak off the short loin — lean enough for a hard sear, marbled enough for a restaurant menu.",
    },
    spec: {
      portionWeightG: 220,
      weightTolerancePct: 5,
      thicknessMm: 22,
    },
    retail: {
      packSizeG: 440,
      price: 1299,
      stockPacks: 12,
      subscribable: false,
    },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 2650,
      moqCases: 2,
      leadTimeDays: 3,
      stockCases: 6,
    },
    seasonal: { isSeasonal: false, season: "", preOrderOpen: false },
  },
  {
    _id: "demo-bratwurst",
    primal: "trim",
    methods: ["Grill", "Fry"],
    name: "Bratwurst, Coarse Ground",
    sku: "SOP-PRK-202",
    category: "pork",
    image: "🌭",
    description:
      "Coarse 8 mm grind, natural casing, 80:20 lean to fat. No fillers, no phosphates.",
    chain: "chilled",
    provenance: {
      farm: "Maple Ridge · EST 243",
      breed: "Large White",
      origin: "Made in Bengaluru from EST 243 trim",
      grade: "Canada 2",
    },
    cutGuide: {
      whatItIs:
        "Fresh sausage in a casing, designed for poaching first and grilling second.",
    },
    spec: {
      portionWeightG: 100,
      weightTolerancePct: 5,
    },
    retail: { packSizeG: 400, price: 429, stockPacks: 30, subscribable: true },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 820,
      moqCases: 2,
      leadTimeDays: 2,
      stockCases: 10,
    },
    seasonal: { isSeasonal: false, season: "", preOrderOpen: false },
  },
  {
    _id: "demo-turkey",
    primal: "",
    methods: ["Roast"],
    name: "Bronze Turkey Crown, Seasonal",
    sku: "SOP-PTR-601",
    category: "poultry",
    image: "🦃",
    description:
      "Seasonal centerpiece with a confirmed pre-order allocation and detailed thawing instructions.",
    chain: "frozen",
    provenance: {
      farm: "Hockley Valley, Ontario",
      breed: "Bronze",
      origin: "Ontario, Canada",
    },
    cutGuide: {
      whatItIs:
        "A whole bird crown built for roasting, with enough size to anchor the seasonal pre-order view.",
    },
    spec: {
      portionWeightG: 3500,
      weightTolerancePct: 8,
    },
    retail: {
      packSizeG: 3500,
      price: 2499,
      stockPacks: 6,
      subscribable: false,
    },
    wholesale: {
      caseSizeKg: 10,
      pricePerKg: 640,
      moqCases: 1,
      leadTimeDays: 5,
      stockCases: 4,
    },
    seasonal: {
      isSeasonal: true,
      season: "Christmas",
      preOrderOpen: true,
      preOrderCutoff: "2026-11-30T00:00:00.000Z",
    },
  },
];

const normalizeText = (value) => String(value || "").toLowerCase();

export function filterDemoProducts({ category, chain, search, seasonal }) {
  const searchTerm = normalizeText(search).trim();

  return demoProducts.filter((product) => {
    const matchesCategory =
      !category || category === "all" || product.category === category;
    const matchesChain = !chain || chain === "all" || product.chain === chain;
    const matchesSeasonal = !seasonal || product.seasonal?.isSeasonal;

    const matchesSearch =
      !searchTerm ||
      [
        product.name,
        product.sku,
        product.description,
        product.cutGuide?.whatItIs,
        product.provenance?.farm,
        product.provenance?.origin,
      ]
        .filter(Boolean)
        .some((field) => normalizeText(field).includes(searchTerm));

    return matchesCategory && matchesChain && matchesSeasonal && matchesSearch;
  });
}

export default demoProducts;
