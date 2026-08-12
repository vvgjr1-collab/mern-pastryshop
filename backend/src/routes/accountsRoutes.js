import express from "express";
import {
  applyForAccount,
  getMyAccount,
  updateAccountStatus,
} from "../controllers/accountsController.js";

const router = express.Router();

router.get("/me", getMyAccount);
router.post("/apply", applyForAccount);
router.put("/:id/status", updateAccountStatus);

export default router;
