import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";
import products from "./products.js";

dotenv.config();

// Loads the catalogue. Run with: npm run seed  (from /backend)
const seed = async () => {
  await connectDB();

  const removed = await Product.deleteMany({});
  console.log(`Cleared ${removed.deletedCount} existing product(s)`);

  const inserted = await Product.insertMany(products);
  console.log(`Seeded ${inserted.length} SKUs into the catalogue`);

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seeding failed", error);
  process.exit(1);
});
