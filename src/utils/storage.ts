const tokenKey = "teppalu-token";
const wishlistKey = "teppalu-wishlist";
const cartKey = "teppalu-cart";

export function storeToken(token: string) {
  localStorage.setItem(tokenKey, JSON.stringify(token));
}

export function restoreToken() {
  const token = localStorage.getItem(tokenKey);
  if (!token) return null;
  else return JSON.parse(token);
}

export function deleteToken() {
  localStorage.removeItem(tokenKey);
}

export function storeCart(cart: any) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

export function storeWishlist(wishlist: any) {
  localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
}

export function restoreCart() {
  const cart = localStorage.getItem(cartKey);
  if (!cart) return { products: [], total: 0 };
  else return JSON.parse(cart);
}

export function restoreWishlist() {
  const wishlist = localStorage.getItem(wishlistKey);
  if (!wishlist) return [];
  else return JSON.parse(wishlist);
}
