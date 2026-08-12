// The Slice of Pink catalogue. Every SKU carries its chain, its provenance,
// its cut guide and its spec — because that is what we sell, not boxes.
const products = [
  // ------------------------- PORK -------------------------
  {
    name: "Berkshire Pork Belly, Skin-On",
    sku: "SOP-PRK-101",
    category: "pork",
    image: "🥓",
    description:
      "Whole-slab belly from Berkshire pigs, skin on, ribs off. Even fat cap for crackling.",
    chain: "chilled",
    storageTemp: "0 to 4 °C",
    onArrival:
      "Check core temp is under 4 °C. Move to chiller within 15 minutes. Do not stack.",
    thawing: "",
    shelfLife: "7 days chilled from dispatch",
    provenance: {
      farm: "Nandini Farms, Kodagu",
      breed: "Berkshire",
      feed: "Maize, soy meal and spent grain, no meat meal",
      origin: "Karnataka, India",
    },
    cutGuide: {
      whatItIs:
        "The fatty underside of the pig, layered fat and meat in bands — the cut bacon and pancetta are made from.",
      whereOnAnimal: "Underside of the mid-section, below the loin.",
      cookMethod: "Score the skin, salt it dry overnight, then slow-roast and blast.",
      cookTemp: "150 °C for the slow phase, 240 °C for the last 20 minutes",
      cookTime: "2.5 hours slow + 20 minutes to crackle",
      chefNote: "If the skin is wet it will not crackle. Dry it uncovered in the chiller.",
    },
    spec: {
      portionWeightG: 1000,
      weightTolerancePct: 5,
      specSheetUrl: "/specs/SOP-PRK-101.pdf",
    },
    retail: { packSizeG: 500, price: 549, stockPacks: 60, subscribable: false },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 720,
      moqCases: 2,
      leadTimeDays: 2,
      stockCases: 24,
    },
  },
  {
    name: "Pork Loin Steaks, Centre-Cut",
    sku: "SOP-PRK-102",
    category: "pork",
    image: "🍖",
    description:
      "Bone-out loin steaks cut to a fixed 22 mm. Lean, quick-cooking, portion-controlled.",
    chain: "chilled",
    storageTemp: "0 to 4 °C",
    onArrival: "Chiller within 15 minutes. Keep in the vacuum bag until service.",
    thawing: "",
    shelfLife: "10 days chilled, vacuum sealed",
    provenance: {
      farm: "Nandini Farms, Kodagu",
      breed: "Berkshire × Large White",
      feed: "Maize, soy meal and spent grain, no meat meal",
      origin: "Karnataka, India",
    },
    cutGuide: {
      whatItIs:
        "A steak off the back muscle — pork's equivalent of a striploin. Lean, so it punishes overcooking.",
      whereOnAnimal: "Along the spine, between shoulder and hind leg.",
      cookMethod: "Hard sear in a heavy pan, finish in the oven, rest.",
      cookTemp: "Sear at max, finish to 62 °C core",
      cookTime: "2 min per side + 4 min oven + 5 min rest",
      chefNote: "Pull at 62 °C. Carryover takes it to 65 °C — pink and safe.",
    },
    spec: {
      portionWeightG: 180,
      weightTolerancePct: 5,
      thicknessMm: 22,
      specSheetUrl: "/specs/SOP-PRK-102.pdf",
    },
    retail: { packSizeG: 360, price: 479, stockPacks: 80, subscribable: false },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 690,
      moqCases: 2,
      leadTimeDays: 2,
      stockCases: 30,
    },
  },
  {
    name: "Pork Shoulder (Boston Butt), Boneless",
    sku: "SOP-PRK-103",
    category: "pork",
    image: "🐖",
    description:
      "Boneless shoulder in 2 kg blocks. Blast-frozen within 6 hours of cutting.",
    chain: "frozen",
    storageTemp: "-18 °C or below",
    onArrival:
      "Straight to the freezer. Reject any block with soft edges or ice glaze inside the bag.",
    thawing:
      "48 hours in the chiller at 2–4 °C, in its bag, on a tray. Never under running water, never on the bench.",
    shelfLife: "9 months frozen",
    provenance: {
      farm: "Nandini Farms, Kodagu",
      breed: "Large White",
      feed: "Maize, soy meal and spent grain, no meat meal",
      origin: "Karnataka, India",
    },
    cutGuide: {
      whatItIs:
        "The upper front leg and shoulder. Heavily worked, full of collagen — the pulled-pork cut.",
      whereOnAnimal: "Front quarter, above the foreleg.",
      cookMethod: "Low and slow until the collagen gives: smoke, braise or oven.",
      cookTemp: "110 °C ambient to a 94 °C core",
      cookTime: "8 to 10 hours",
      chefNote: "Cook to feel, not to clock. It is done when a probe slides in with no resistance.",
    },
    spec: {
      portionWeightG: 2000,
      weightTolerancePct: 8,
      specSheetUrl: "/specs/SOP-PRK-103.pdf",
    },
    retail: { packSizeG: 1000, price: 719, stockPacks: 45, subscribable: false },
    wholesale: {
      caseSizeKg: 10,
      pricePerKg: 560,
      moqCases: 1,
      leadTimeDays: 2,
      stockCases: 40,
    },
  },
  {
    name: "Dry-Cured Streaky Bacon, 2 mm",
    sku: "SOP-PRK-201",
    category: "pork",
    image: "🥓",
    description:
      "Dry-cured 10 days, cold-smoked over applewood, machine-sliced at a fixed 2 mm.",
    chain: "chilled",
    storageTemp: "0 to 4 °C",
    onArrival: "Chiller within 15 minutes. Opened packs: use within 4 days.",
    thawing: "",
    shelfLife: "21 days chilled, unopened",
    provenance: {
      farm: "Nandini Farms, Kodagu",
      breed: "Berkshire",
      feed: "Maize, soy meal and spent grain, no meat meal",
      origin: "Cured and smoked in Bengaluru",
    },
    cutGuide: {
      whatItIs:
        "Cured, smoked belly, sliced. Streaky means belly — back bacon is the loin, and behaves differently.",
      whereOnAnimal: "Belly, underside of the mid-section.",
      cookMethod: "Start in a cold pan so the fat renders before the meat colours.",
      cookTemp: "Medium, around 160 °C surface",
      cookTime: "6 to 8 minutes, turning once",
      chefNote: "Dry-cured, not brine-injected: it renders instead of leaking water into the pan.",
    },
    spec: {
      portionWeightG: 250,
      weightTolerancePct: 3,
      sliceThicknessMm: 2,
      specSheetUrl: "/specs/SOP-PRK-201.pdf",
    },
    retail: { packSizeG: 250, price: 399, stockPacks: 120, subscribable: true },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 1180,
      moqCases: 2,
      leadTimeDays: 2,
      stockCases: 26,
    },
  },
  {
    name: "Bratwurst, Coarse Ground",
    sku: "SOP-PRK-202",
    category: "pork",
    image: "🌭",
    description:
      "Coarse 8 mm grind, natural hog casing, 80:20 lean to fat. No fillers, no phosphates.",
    chain: "chilled",
    storageTemp: "0 to 4 °C",
    onArrival: "Chiller within 15 minutes. Keep links flat, do not pile.",
    thawing: "",
    shelfLife: "12 days chilled",
    provenance: {
      farm: "Nandini Farms, Kodagu",
      breed: "Large White",
      feed: "Maize, soy meal and spent grain, no meat meal",
      origin: "Made in Bengaluru",
    },
    cutGuide: {
      whatItIs:
        "Fresh (uncured) sausage — raw meat in a casing, so it must be cooked through.",
      whereOnAnimal: "Shoulder and belly trim, ground and emulsified.",
      cookMethod: "Poach then grill, or pan-roast gently. Never prick the casing.",
      cookTemp: "Poach at 75 °C, then grill to a 72 °C core",
      cookTime: "10 min poach + 4 min on the grill",
      chefNote: "Pricking releases the fat you paid for. Cook gently and it stays inside.",
    },
    spec: {
      portionWeightG: 100,
      weightTolerancePct: 5,
      specSheetUrl: "/specs/SOP-PRK-202.pdf",
    },
    retail: { packSizeG: 400, price: 429, stockPacks: 90, subscribable: true },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 820,
      moqCases: 2,
      leadTimeDays: 2,
      stockCases: 22,
    },
  },
  {
    name: "Chorizo Picante, Fresh",
    sku: "SOP-PRK-203",
    category: "pork",
    image: "🌶️",
    description:
      "Fresh cooking chorizo with smoked pimentón. Blast-frozen in 1 kg links.",
    chain: "frozen",
    storageTemp: "-18 °C or below",
    onArrival: "Freezer immediately. Do not accept if the bag is soft.",
    thawing: "24 hours in the chiller at 2–4 °C. Cook within 48 hours of thawing.",
    shelfLife: "6 months frozen",
    provenance: {
      farm: "Nandini Farms, Kodagu",
      breed: "Large White",
      feed: "Maize, soy meal and spent grain, no meat meal",
      origin: "Made in Bengaluru, pimentón from Extremadura",
    },
    cutGuide: {
      whatItIs:
        "Fresh chorizo — raw and soft, for cooking. Not the hard cured chorizo you slice and eat.",
      whereOnAnimal: "Shoulder and belly trim.",
      cookMethod: "Render in a dry pan and use the coloured fat as your cooking medium.",
      cookTemp: "Medium, around 160 °C",
      cookTime: "8 to 10 minutes",
      chefNote: "The orange fat is the point. Build the dish in it.",
    },
    spec: {
      portionWeightG: 1000,
      weightTolerancePct: 5,
      specSheetUrl: "/specs/SOP-PRK-203.pdf",
    },
    retail: { packSizeG: 500, price: 549, stockPacks: 70, subscribable: false },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 940,
      moqCases: 2,
      leadTimeDays: 3,
      stockCases: 18,
    },
  },

  // ---------------------- COLD CUTS ----------------------
  {
    name: "Coppa (Capocollo), Whole Muscle",
    sku: "SOP-CUT-301",
    category: "cold-cuts",
    image: "🍑",
    description:
      "Whole pork neck, salt-cured with black pepper and fennel, air-dried 90 days.",
    chain: "ambient-cured",
    storageTemp: "12 to 18 °C whole, 4 °C once sliced",
    onArrival:
      "Ready to eat — no kill step left. Store away from raw meat, use dedicated boards and a clean slicer.",
    thawing: "",
    shelfLife: "90 days whole, 5 days sliced",
    provenance: {
      farm: "Nandini Farms, Kodagu",
      breed: "Berkshire",
      feed: "Maize, soy meal and spent grain, no meat meal",
      origin: "Cured in Bengaluru, 90-day dry room",
    },
    cutGuide: {
      whatItIs:
        "Cured pork neck — the muscle between shoulder and head. Fattier and sweeter than prosciutto, which is the hind leg.",
      whereOnAnimal: "Neck and upper shoulder.",
      cookMethod: "None. Slice paper-thin and let it come to room temperature.",
      cookTemp: "Serve at 18 to 20 °C",
      cookTime: "20 minutes out of the chiller before service",
      chefNote: "Cold coppa tastes of nothing. Warm it in the hand or on the plate.",
    },
    spec: {
      portionWeightG: 1500,
      weightTolerancePct: 10,
      sliceThicknessMm: 1.5,
      specSheetUrl: "/specs/SOP-CUT-301.pdf",
    },
    retail: { packSizeG: 200, price: 899, stockPacks: 40, subscribable: false },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 3200,
      moqCases: 1,
      leadTimeDays: 4,
      stockCases: 9,
    },
  },
  {
    name: "Pancetta Tesa, Flat-Cured",
    sku: "SOP-CUT-302",
    category: "cold-cuts",
    image: "🥓",
    description:
      "Flat-cured belly with juniper and bay, 60 days. Sold in blocks for lardons.",
    chain: "ambient-cured",
    storageTemp: "12 to 18 °C whole, 4 °C once cut",
    onArrival: "Store away from raw meat. Cut on a dedicated board.",
    thawing: "",
    shelfLife: "60 days whole, 10 days cut",
    provenance: {
      farm: "Nandini Farms, Kodagu",
      breed: "Berkshire",
      feed: "Maize, soy meal and spent grain, no meat meal",
      origin: "Cured in Bengaluru",
    },
    cutGuide: {
      whatItIs:
        "Cured, unsmoked belly. Tesa means flat — rolled pancetta is arrotolata and slices differently.",
      whereOnAnimal: "Belly.",
      cookMethod: "Dice into lardons and render slowly, or slice thin over a pizza.",
      cookTemp: "Low, 140 °C, so the fat renders before the edges catch",
      cookTime: "8 to 10 minutes for lardons",
      chefNote: "Cured but not cooked. It needs heat before it goes on a plate.",
    },
    spec: {
      portionWeightG: 1000,
      weightTolerancePct: 8,
      sliceThicknessMm: 2,
      specSheetUrl: "/specs/SOP-CUT-302.pdf",
    },
    retail: { packSizeG: 200, price: 649, stockPacks: 50, subscribable: false },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 2400,
      moqCases: 1,
      leadTimeDays: 4,
      stockCases: 12,
    },
  },
  {
    name: "Mortadella with Pistachio",
    sku: "SOP-CUT-303",
    category: "cold-cuts",
    image: "🫒",
    description:
      "Fine emulsion with lardons and Bronte pistachio, steam-cooked, sliced to 1 mm.",
    chain: "ambient-cured",
    storageTemp: "4 °C once opened",
    onArrival:
      "Ready to eat. Keep sealed until service, then chiller. Dedicated slicer.",
    thawing: "",
    shelfLife: "45 days sealed, 4 days opened",
    provenance: {
      farm: "Nandini Farms, Kodagu",
      breed: "Large White",
      feed: "Maize, soy meal and spent grain, no meat meal",
      origin: "Made in Bengaluru, pistachio from Sicily",
    },
    cutGuide: {
      whatItIs:
        "A cooked emulsified sausage — smooth paste studded with cubes of back fat. Not bologna's cousin; bologna is its imitation.",
      whereOnAnimal: "Shoulder trim and back fat.",
      cookMethod: "None. Slice at 1 mm, wide, and lay it in folds.",
      cookTemp: "Serve at 16 to 18 °C",
      cookTime: "Slice to order",
      chefNote: "Cut too thick it turns rubbery. 1 mm or it is not mortadella.",
    },
    spec: {
      portionWeightG: 2000,
      weightTolerancePct: 6,
      sliceThicknessMm: 1,
      specSheetUrl: "/specs/SOP-CUT-303.pdf",
    },
    retail: { packSizeG: 200, price: 549, stockPacks: 55, subscribable: false },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 1950,
      moqCases: 1,
      leadTimeDays: 3,
      stockCases: 15,
    },
  },

  // ------------------------ STEAK ------------------------
  {
    name: "Picanha (Rump Cap), Fat On",
    sku: "SOP-STK-401",
    category: "steak",
    image: "🔥",
    description:
      "Whole rump caps, 1.2 kg average, fat cap trimmed to 10 mm. Grain-fed, imported.",
    chain: "frozen",
    storageTemp: "-18 °C or below",
    onArrival:
      "Freezer immediately. Check the box for ice crystals — that means it thawed in transit.",
    thawing:
      "36 to 48 hours in the chiller at 2–4 °C, in the vacuum bag. Open, pat dry, rest 1 hour before cooking.",
    shelfLife: "12 months frozen",
    provenance: {
      origin: "Rio Grande do Sul, Brazil",
      breed: "Nelore",
      grade: "Grain-finished 100 days",
      feed: "Pasture then grain finish",
    },
    cutGuide: {
      whatItIs:
        "The cap of muscle sitting on top of the rump, with its fat layer intact. Not a ribeye: leaner, chewier, far more beefy.",
      whereOnAnimal: "Top of the hindquarter, over the rump.",
      cookMethod:
        "Cut into thick steaks against the grain, or skewer whole and roast fat-side to the heat.",
      cookTemp: "Very high surface heat, pull at a 52 °C core",
      cookTime: "4 min per side for a 40 mm steak + 8 min rest",
      chefNote: "Render the fat cap first, on its edge, before you sear the faces.",
    },
    spec: {
      portionWeightG: 1200,
      weightTolerancePct: 10,
      thicknessMm: 40,
      specSheetUrl: "/specs/SOP-STK-401.pdf",
    },
    retail: { packSizeG: 500, price: 1249, stockPacks: 35, subscribable: false },
    wholesale: {
      caseSizeKg: 10,
      pricePerKg: 1780,
      moqCases: 1,
      leadTimeDays: 3,
      stockCases: 14,
    },
  },
  {
    name: "Ribeye, Grain-Fed MB 2+",
    sku: "SOP-STK-402",
    category: "steak",
    image: "🥩",
    description:
      "Portion-cut ribeye at a fixed 30 mm, 300 g, marble score 2 or better.",
    chain: "frozen",
    storageTemp: "-18 °C or below",
    onArrival: "Freezer immediately. Count portions against the spec sheet on arrival.",
    thawing:
      "24 hours in the chiller at 2–4 °C on a rack. Pat dry and temper 45 minutes before service.",
    shelfLife: "12 months frozen",
    provenance: {
      origin: "Queensland, Australia",
      breed: "Angus cross",
      grade: "MSA graded, marble score 2+",
      feed: "Grain-finished 150 days",
    },
    cutGuide: {
      whatItIs:
        "A steak from the rib section, with the fat-marbled eye and the richer spinalis cap around it. Fattier than picanha, more forgiving than fillet.",
      whereOnAnimal: "Upper rib, between chuck and loin.",
      cookMethod: "Screaming hot cast iron, baste with butter, rest half the cook time.",
      cookTemp: "Pan at 240 °C+, pull at 52 °C for medium-rare",
      cookTime: "3 min per side + 5 min rest",
      chefNote: "The cap is the best part. Cut it off, cook it hotter, serve it separately.",
    },
    spec: {
      portionWeightG: 300,
      weightTolerancePct: 4,
      thicknessMm: 30,
      specSheetUrl: "/specs/SOP-STK-402.pdf",
    },
    retail: { packSizeG: 600, price: 1899, stockPacks: 28, subscribable: false },
    wholesale: {
      caseSizeKg: 10,
      pricePerKg: 2650,
      moqCases: 1,
      leadTimeDays: 3,
      stockCases: 10,
    },
  },
  {
    name: "Tenderloin Medallions",
    sku: "SOP-STK-403",
    category: "steak",
    image: "🍽️",
    description: "Centre-cut fillet medallions, 180 g, 35 mm, silverskin off.",
    chain: "frozen",
    storageTemp: "-18 °C or below",
    onArrival: "Freezer immediately. Portions are counted, not weighed, on the docket.",
    thawing: "18 to 24 hours in the chiller at 2–4 °C. Do not thaw at room temperature.",
    shelfLife: "12 months frozen",
    provenance: {
      origin: "Queensland, Australia",
      breed: "Angus cross",
      grade: "MSA graded",
      feed: "Grain-finished 150 days",
    },
    cutGuide: {
      whatItIs:
        "The psoas muscle — the least worked muscle on the animal, so the most tender and the least flavourful.",
      whereOnAnimal: "Under the spine, along the short loin.",
      cookMethod: "Quick sear, gentle finish. It has no fat to defend itself.",
      cookTemp: "Pull at 52 °C core",
      cookTime: "2.5 min per side + 5 min rest",
      chefNote: "Past medium it is dry and there is no getting it back. Probe it.",
    },
    spec: {
      portionWeightG: 180,
      weightTolerancePct: 4,
      thicknessMm: 35,
      specSheetUrl: "/specs/SOP-STK-403.pdf",
    },
    retail: { packSizeG: 360, price: 2199, stockPacks: 20, subscribable: false },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 3450,
      moqCases: 1,
      leadTimeDays: 3,
      stockCases: 8,
    },
  },

  // ----------------------- SEAFOOD -----------------------
  {
    name: "Atlantic Salmon Fillet, Skin-On",
    sku: "SOP-SEA-501",
    category: "seafood",
    image: "🐟",
    description:
      "Trim D fillets, pin-boned, skin on, blast-frozen at sea-side within 12 hours of harvest.",
    chain: "frozen",
    storageTemp: "-18 °C or below",
    onArrival:
      "Freezer immediately. Glazed product — a light ice film is correct, loose ice crystals are not.",
    thawing:
      "Overnight in the chiller at 2–4 °C on a perforated tray so it drains. Use within 24 hours of thawing. Never refreeze.",
    shelfLife: "9 months frozen",
    provenance: {
      origin: "Norway",
      catchMethod: "Farmed, ASC certified",
      landingRegion: "Hardangerfjord",
      grade: "Superior, Trim D",
    },
    cutGuide: {
      whatItIs:
        "A side of salmon, pin bones pulled, belly fat and fin line trimmed (that is what Trim D means).",
      whereOnAnimal: "Full side, head to tail.",
      cookMethod: "Skin-side down in a hot dry pan, press flat, do not move it.",
      cookTemp: "180 °C pan, pull at a 48 °C core",
      cookTime: "5 min skin down, 1 min flipped",
      chefNote: "Salt the skin 10 minutes ahead and blot it. That is the whole trick.",
    },
    spec: {
      portionWeightG: 180,
      weightTolerancePct: 6,
      thicknessMm: 25,
      specSheetUrl: "/specs/SOP-SEA-501.pdf",
    },
    retail: { packSizeG: 360, price: 1099, stockPacks: 42, subscribable: false },
    wholesale: {
      caseSizeKg: 10,
      pricePerKg: 1650,
      moqCases: 1,
      leadTimeDays: 3,
      stockCases: 16,
    },
  },
  {
    name: "Tiger Prawns 16/20, PDTO",
    sku: "SOP-SEA-502",
    category: "seafood",
    image: "🦐",
    description:
      "Peeled, deveined, tail-on. 16 to 20 pieces per pound, IQF with a 10% glaze.",
    chain: "frozen",
    storageTemp: "-18 °C or below",
    onArrival: "Freezer immediately. Clumped blocks mean a thaw-refreeze — reject them.",
    thawing:
      "In the chiller for 8 hours, or under cold running water in a sealed bag for 20 minutes. Never in warm water.",
    shelfLife: "18 months frozen",
    provenance: {
      origin: "Andhra Pradesh, India",
      catchMethod: "Farmed, BAP 3-star",
      landingRegion: "Kakinada",
      grade: "16/20 count, PDTO",
    },
    cutGuide: {
      whatItIs:
        "Count size 16/20 means 16 to 20 prawns per pound — the lower the count, the bigger the prawn.",
      whereOnAnimal: "Whole tail meat, shell off, vein removed, tail fan left on.",
      cookMethod: "Very hot, very fast. They are done the moment they turn opaque.",
      cookTemp: "High heat, 200 °C+ surface",
      cookTime: "90 seconds per side",
      chefNote: "Pat them bone dry first or they steam grey instead of colouring.",
    },
    spec: {
      portionWeightG: 500,
      weightTolerancePct: 5,
      specSheetUrl: "/specs/SOP-SEA-502.pdf",
    },
    retail: { packSizeG: 500, price: 849, stockPacks: 65, subscribable: false },
    wholesale: {
      caseSizeKg: 10,
      pricePerKg: 1180,
      moqCases: 1,
      leadTimeDays: 2,
      stockCases: 20,
    },
  },

  // ----------------------- POULTRY -----------------------
  {
    name: "Whole Turkey, Free-Range",
    sku: "SOP-POU-601",
    category: "poultry",
    image: "🦃",
    description:
      "Free-range bronze turkey, 5 to 6 kg, giblets in. Pre-order only — Christmas allocation.",
    chain: "frozen",
    storageTemp: "-18 °C or below",
    onArrival: "Freezer immediately. Plan freezer space before the drop — these are bulky.",
    thawing:
      "3 full days in the chiller at 2–4 °C for a 6 kg bird, on a tray, breast up. Roughly 10 hours per kg. Start on the 22nd for the 25th.",
    shelfLife: "12 months frozen",
    provenance: {
      farm: "Highfield Poultry, Nilgiris",
      breed: "Bronze",
      feed: "Free-range, maize and greens",
      origin: "Tamil Nadu, India",
    },
    cutGuide: {
      whatItIs:
        "A whole bird with two problems: the breast dries out before the leg is cooked.",
      whereOnAnimal: "Whole.",
      cookMethod:
        "Brine 24 hours, roast breast-down for the first hour, then flip. Or spatchcock and cook it flat.",
      cookTemp: "180 °C oven, 74 °C in the thigh, 65 °C in the breast",
      cookTime: "About 35 minutes per kg + 40 minutes rest",
      chefNote: "The rest is not optional. Forty minutes, loosely tented.",
    },
    spec: {
      portionWeightG: 5500,
      weightTolerancePct: 10,
      specSheetUrl: "/specs/SOP-POU-601.pdf",
    },
    retail: { packSizeG: 5500, price: 4499, stockPacks: 0, subscribable: false },
    wholesale: {
      caseSizeKg: 11,
      pricePerKg: 690,
      moqCases: 1,
      leadTimeDays: 14,
      stockCases: 0,
    },
    seasonal: {
      isSeasonal: true,
      season: "Christmas — December",
      preOrderOpen: true,
      preOrderCutoff: new Date("2026-11-30T18:00:00Z"),
    },
  },
  {
    name: "Duck Breast (Magret), Skin-On",
    sku: "SOP-POU-602",
    category: "poultry",
    image: "🦆",
    description:
      "Single lobes, 350 g, thick fat cap scored. Spikes around Christmas — pre-order from October.",
    chain: "frozen",
    storageTemp: "-18 °C or below",
    onArrival: "Freezer immediately.",
    thawing: "24 hours in the chiller at 2–4 °C. Dry the skin uncovered for 2 hours before cooking.",
    shelfLife: "12 months frozen",
    provenance: {
      farm: "Highfield Poultry, Nilgiris",
      breed: "Pekin",
      feed: "Maize and greens",
      origin: "Tamil Nadu, India",
    },
    cutGuide: {
      whatItIs:
        "The breast of a duck raised for meat, with a fat cap far thicker than chicken — that fat is the cooking medium.",
      whereOnAnimal: "Breast, one lobe per portion.",
      cookMethod: "Score the fat, start skin-down in a cold dry pan, render 8 minutes, then flip.",
      cookTemp: "Start cold, build to medium. Pull at a 54 °C core",
      cookTime: "8 min skin down + 2 min flipped + 6 min rest",
      chefNote: "Pour the rendered fat off as it collects, or it fries instead of rendering. Keep it — it is worth money.",
    },
    spec: {
      portionWeightG: 350,
      weightTolerancePct: 7,
      specSheetUrl: "/specs/SOP-POU-602.pdf",
    },
    retail: { packSizeG: 350, price: 1099, stockPacks: 30, subscribable: false },
    wholesale: {
      caseSizeKg: 5,
      pricePerKg: 1850,
      moqCases: 1,
      leadTimeDays: 5,
      stockCases: 11,
    },
    seasonal: {
      isSeasonal: true,
      season: "October to January",
      preOrderOpen: true,
      preOrderCutoff: new Date("2026-11-30T18:00:00Z"),
    },
  },
];

export default products;
