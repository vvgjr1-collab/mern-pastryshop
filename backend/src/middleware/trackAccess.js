import Account from "../models/Account.js";

// Decides which door the request came through.
// A request is wholesale ONLY if it carries an x-account-key that belongs to an
// approved account. Everything else is retail — which means wholesale rates are
// never serialised for a consumer, no matter what the client asks for.
const trackAccess = async (req, res, next) => {
  try {
    const accountKey = req.header("x-account-key");

    req.track = "retail";
    req.account = null;

    if (accountKey) {
      const account = await Account.findOne({ accountKey });
      if (account && account.status === "approved") {
        req.track = "wholesale";
        req.account = account;
      }
    }

    next();
  } catch (error) {
    console.log("Track access error", error);
    next(error);
  }
};

export default trackAccess;
