// Wholesale account state, kept in localStorage the same way the user id is.
// The key is what unlocks the rate card server-side — the browser only decides
// which door to *ask* for; the API decides what it hands back.

const KEY = "sop_accountKey";
const TRACK = "sop_track";
const ACCOUNT = "sop_account";

const announce = () => window.dispatchEvent(new Event("account:updated"));

export const getAccountKey = () => localStorage.getItem(KEY) || "";

export const getStoredAccount = () => {
  try {
    const raw = localStorage.getItem(ACCOUNT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveAccount = (account) => {
  localStorage.setItem(ACCOUNT, JSON.stringify(account));
  if (account?.status === "approved" && account?.accountKey) {
    localStorage.setItem(KEY, account.accountKey);
    localStorage.setItem(TRACK, "wholesale");
  }
  announce();
  return account;
};

export const clearAccount = () => {
  localStorage.removeItem(KEY);
  localStorage.removeItem(ACCOUNT);
  localStorage.setItem(TRACK, "retail");
  announce();
};

export const hasWholesaleAccess = () => {
  const account = getStoredAccount();
  return !!getAccountKey() && account?.status === "approved";
};

// A trade buyer can still shop the consumer door — the preference decides
// which prices they are shown, and the key only rides along on wholesale calls.
export const getTrack = () => {
  const preferred = localStorage.getItem(TRACK) || "retail";
  return preferred === "wholesale" && hasWholesaleAccess() ? "wholesale" : "retail";
};

export const setTrack = (track) => {
  localStorage.setItem(TRACK, track === "wholesale" ? "wholesale" : "retail");
  announce();
  return getTrack();
};
