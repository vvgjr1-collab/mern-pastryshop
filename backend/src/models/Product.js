import mongoose from "mongoose";

//1 create schema
//2 model based off of that schema

// One SKU lives in BOTH tracks: the same product carries a retail block
// (200g/500g packs, price visible to everyone) and a wholesale block
// (5kg/10kg cases, rate card) which is only ever serialised for approved
// wholesale accounts. See middleware/trackAccess.js + controllers.
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      // the ranges we actually carry
      enum: ["pork", "cold-cuts", "steak", "seafood", "poultry"],
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String, // emoji or image URL — kept simple, no upload pipeline
      default: "🥩",
    },

    // ---- Principle 1: cold chain. Three chains, three sets of rules ----
    chain: {
      type: String,
      required: true,
      enum: ["chilled", "frozen", "ambient-cured"],
      index: true,
    },
    storageTemp: {
      type: String, // e.g. "0 to 4 °C"
      required: true,
    },
    onArrival: {
      type: String, // what the buyer must do the moment the box lands
      default: "",
    },
    thawing: {
      type: String, // required reading for anything frozen
      default: "",
    },
    shelfLife: {
      type: String,
      default: "",
    },

    // ---- Principle 2: provenance. Farm, feed, breed / origin, grade / catch ----
    provenance: {
      farm: { type: String, default: "" },
      breed: { type: String, default: "" },
      feed: { type: String, default: "" },
      origin: { type: String, default: "" },
      grade: { type: String, default: "" },
      catchMethod: { type: String, default: "" },
      landingRegion: { type: String, default: "" },
    },

    // ---- Principle 3: cut literacy. Every product page teaches the cut ----
    cutGuide: {
      whatItIs: { type: String, default: "" },
      whereOnAnimal: { type: String, default: "" },
      cookMethod: { type: String, default: "" },
      cookTemp: { type: String, default: "" }, // e.g. "220 °C oven / 54 °C core"
      cookTime: { type: String, default: "" }, // e.g. "3 min per side + 5 min rest"
      chefNote: { type: String, default: "" },
    },

    // ---- Principle 4: consistency of spec. Chefs cost menus on these ----
    spec: {
      portionWeightG: { type: Number, default: null },
      weightTolerancePct: { type: Number, default: null },
      thicknessMm: { type: Number, default: null }, // steaks
      sliceThicknessMm: { type: Number, default: null }, // cold cuts
      specSheetUrl: { type: String, default: "" }, // downloadable, wholesale only
    },

    // ---- Consumer track: open catalogue, retail packs, prices visible ----
    retail: {
      packSizeG: { type: Number, required: true },
      price: { type: Number, required: true }, // per pack, INR
      stockPacks: { type: Number, default: 0 },
      subscribable: { type: Boolean, default: false }, // bacon, sausages, staples
    },

    // ---- Wholesale track: case sizes, rate card, MOQ. Never serialised
    // for a consumer request. ----
    wholesale: {
      caseSizeKg: { type: Number, required: true },
      pricePerKg: { type: Number, required: true }, // INR, rate card
      moqCases: { type: Number, default: 1 },
      leadTimeDays: { type: Number, default: 2 },
      stockCases: { type: Number, default: 0 },
    },

    // ---- Principle 6: seasonal readiness. Turkey is a Christmas business ----
    seasonal: {
      isSeasonal: { type: Boolean, default: false },
      season: { type: String, default: "" }, // e.g. "Christmas — Dec"
      preOrderOpen: { type: Boolean, default: false },
      preOrderCutoff: { type: Date, default: null },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } //createdAt, updatedAt
);

const Product = mongoose.model("Product", productSchema);

export default Product;
