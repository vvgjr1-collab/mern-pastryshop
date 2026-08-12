import express from "express";
import {
  createProduct,
  getProductById,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/productsController.js";
import trackAccess from "../middleware/trackAccess.js";

const router = express.Router();

// every read has to know which door it came through before it answers
router.get("/", trackAccess, getAllProducts);
router.get("/:id", trackAccess, getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
