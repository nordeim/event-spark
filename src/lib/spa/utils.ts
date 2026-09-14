import { format, parseISO } from "date-fns";

/** Generates a reasonably unique id without external dependencies. */
export function generateId(prefix = "id"): string {
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${random}`;
}

/** Slugifies an event name and appends a short random suffix, mirroring the reference slug format. */
export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${Math.random().toString(36).substring(2, 8)}`;
}

export function formatDateShort(iso: string): string {
  try {
    return format(parseISO(iso), "EEE, MMM d");
  } catch {
    return iso;
  }
}

export function formatDateLong(iso: string): string {
  try {
    return format(parseISO(iso), "EEE, MMM d, yyyy");
  } catch {
    return iso;
  }
}

export function formatDateNumeric(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
}

export function formatPrice(price: number): string {
  if (price <= 0) return "FREE";
  return `$${price}`;
}

/** SHA-256 hex digest of a string, using the Web Crypto API (async). */
export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Simple e-mail validation (RFC-lite). Deliberately permissive:
 * full RFC 5321 validation belongs on the server.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Deterministic pseudo-random generator so derived demo data stays stable. */
export function seededRandom(seed: number): () => number {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}
