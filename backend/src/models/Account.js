import mongoose from "mongoose";

// Wholesale accounts. The rate card lives behind this: a request only sees
// wholesale pricing if it carries an accountKey belonging to an APPROVED
// account (see middleware/trackAccess.js).
const accountSchema = new mongoose.Schema(
  {
    accountKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      enum: ["restaurant", "hotel", "cloud-kitchen", "retailer", "caterer", "other"],
      default: "restaurant",
    },
    contactName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gstin: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    fssai: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    creditTerms: {
      type: String,
      default: "Advance on first 3 orders, then net 15",
    },
    // named account contact — wholesale buyers get a person, not a helpdesk
    accountManager: {
      name: { type: String, default: "Mr. Kamal Ratreja" },
      phone: { type: String, default: "+91 98217 00016" },
      email: { type: String, default: "trade@sliceofpink.in" },
    },
  },
  { timestamps: true } //createdAt, updatedAt
);

const Account = mongoose.model("Account", accountSchema);

export default Account;
