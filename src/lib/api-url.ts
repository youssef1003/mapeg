/**
 * Helper to ensure API URLs are always correct (no locale prefix)
 * Usage: fetch(apiUrl("/auth/login"), ...)
 */
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`
  return p.startsWith("/api/") ? p : `/api${p}`
}
