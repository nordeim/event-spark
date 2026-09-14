"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Minimal hash-based router. The whole app is served from a single Next.js
 * route ("/"), so in-app navigation uses the URL fragment: #/dashboard/events.
 * This keeps deep links and browser back/forward working without a server.
 */

function readHash(): string {
  if (typeof window === "undefined") return "/";
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw || raw === "/") return "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

export function navigate(path: string): void {
  if (typeof window === "undefined") return;
  const target = path.startsWith("/") ? path : `/${path}`;
  if (readHash() === target) return;
  window.location.hash = `#${target}`;
}

export function useHashRoute(): string {
  const [path, setPath] = useState<string>("/");

  useEffect(() => {
    const update = () => setPath(readHash());
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  return path;
}

/** Splits a route path into segments: "/dashboard/events/evt_1" -> ["dashboard", "events", "evt_1"]. */
export function routeSegments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

/** Convenience hook returning a stable navigate callback. */
export function useNavigate() {
  return useCallback((path: string) => navigate(path), []);
}
