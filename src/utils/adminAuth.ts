export const ADMIN_AUTH_KEY = "pollAdminUnlocked";

export function isAdminUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
}
