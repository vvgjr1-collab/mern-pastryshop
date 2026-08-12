import express from "express";
import {
  createOrder,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrder,
} from "../controllers/ordersController.js";
import trackAccess from "../middleware/trackAccess.js";

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", trackAccess, createOrder); // pricing depends on the track
router.put("/:id", updateOrder);
router.delete("/:id", cancelOrder);

export default router;
