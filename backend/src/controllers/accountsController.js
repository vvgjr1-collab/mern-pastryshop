import Account from "../models/Account.js";

function makeAccountKey() {
  return `sop_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .substring(2, 8)}`;
}

// New wholesale account application. GST + FSSAI are mandatory — we cannot
// invoice a trade buyer without them.
export async function applyForAccount(req, res) {
  try {
    const {
      userId,
      businessName,
      businessType,
      contactName,
      phone,
      email,
      gstin,
      fssai,
      deliveryAddress,
      city,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const missing = [
      ["businessName", businessName],
      ["contactName", contactName],
      ["phone", phone],
      ["email", email],
      ["gstin", gstin],
      ["fssai", fssai],
      ["deliveryAddress", deliveryAddress],
    ].filter(([, value]) => !value || !String(value).trim());

    if (missing.length) {
      return res.status(400).json({
        message: `Missing required field(s): ${missing
          .map(([key]) => key)
          .join(", ")}`,
      });
    }

    const account = new Account({
      accountKey: makeAccountKey(),
      userId,
      businessName,
      businessType,
      contactName,
      phone,
      email,
      gstin,
      fssai,
      deliveryAddress,
      city,
      // In a real deployment trade applications are verified by a human before
      // the rate card opens up. Outside production we approve on the spot so
      // the wholesale door is walkable — and TRADE_AUTO_APPROVE=true does the
      // same on a deployed demo, where "pending" otherwise leaves the whole
      // trade half of the site unreachable. Never set it on the real shop.
      status:
        process.env.TRADE_AUTO_APPROVE === "true" ||
        process.env.NODE_ENV !== "production"
          ? "approved"
          : "pending",
    });

    const savedAccount = await account.save();
    res.status(201).json(savedAccount);
  } catch (error) {
    console.error("Error in applyForAccount controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Who am I? Used by the storefront to decide which door to show.
export async function getMyAccount(req, res) {
  try {
    const accountKey = req.header("x-account-key");
    const { userId } = req.query;

    const account = accountKey
      ? await Account.findOne({ accountKey })
      : userId
      ? await Account.findOne({ userId }).sort({ createdAt: -1 })
      : null;

    if (!account) return res.status(404).json({ message: "No account found" });

    res.json(account);
  } catch (error) {
    console.error("Error in getMyAccount controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Back-office: flip an application to approved / rejected.
export async function updateAccountStatus(req, res) {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const account = await Account.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!account) return res.status(404).json({ message: "Account not found" });

    res.json(account);
  } catch (error) {
    console.error("Error in updateAccountStatus controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
