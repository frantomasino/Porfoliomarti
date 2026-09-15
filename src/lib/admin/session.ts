export const ADMIN_COOKIE = "atelier_admin";

export function getAdminToken() {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return `v1-${hash(`atelier-admin:${password}`)}`;
}

export function isValidAdminToken(token?: string | null) {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  return token === getAdminToken();
}

export function passwordsMatch(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return input === expected;
}

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(16).padStart(8, "0");
}
