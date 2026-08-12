// Cart in localStorage, alongside the user id. A cart belongs to one track:
// retail packs and wholesale cases are different units, so switching doors
// starts a fresh cart rather than mixing them.

const CART_KEY = "sop_cart";
const empty = { track: "retail", lines: [] };

const announce = () => window.dispatchEvent(new Event("cart:updated"));

const save = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  announce();
  return cart;
};

export const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || !Array.isArray(parsed.lines)) return { ...empty };
    return parsed;
  } catch {
    return { ...empty };
  }
};

export const addToCart = (line, track) => {
  const cart = getCart();

  // different door, different units — start clean
  if (cart.track !== track) {
    cart.track = track;
    cart.lines = [];
  }

  const existing = cart.lines.find((l) => l.productId === line.productId);
  if (existing) {
    existing.quantity += line.quantity;
  } else {
    cart.lines.push({ ...line });
  }

  return save(cart);
};

export const updateQuantity = (productId, quantity) => {
  const cart = getCart();
  const line = cart.lines.find((l) => l.productId === productId);
  if (!line) return cart;

  if (quantity < 1) {
    cart.lines = cart.lines.filter((l) => l.productId !== productId);
  } else {
    line.quantity = quantity;
  }

  return save(cart);
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  cart.lines = cart.lines.filter((l) => l.productId !== productId);
  return save(cart);
};

export const clearCart = () => save({ ...empty, track: getCart().track });

export const cartCount = () =>
  getCart().lines.reduce((sum, line) => sum + line.quantity, 0);

export const cartSubtotal = () =>
  getCart().lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
