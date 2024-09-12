const tokenKey = "hex-ecommerce-token";

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
