"use client";

import { seededRandom } from "@/lib/spa/utils";

/**
 * Deterministic decorative QR-style block for demo tickets.
 * This is NOT a scannable QR code — it visualizes the registration id.
 * A real deployment would render an actual QR encoding the check-in URL.
 */
export function TicketQrCode({
  seed,
  size = 128,
  className,
}: {
  seed: string;
  size?: number;
  className?: string;
}) {
  const cellCount = 21;
  const cell = size / cellCount;
  let numericSeed = 0;
  for (let i = 0; i < seed.length; i++) {
    numericSeed = (numericSeed * 31 + seed.charCodeAt(i)) % 2147483647;
  }
  const rand = seededRandom(numericSeed || 1);

  const isFinder = (x: number, y: number): "solid" | "ring" | "hole" | null => {
    const inFinderArea =
      (x < 7 && y < 7) ||
      (x >= cellCount - 7 && y < 7) ||
      (x < 7 && y >= cellCount - 7);
    if (!inFinderArea) return null;
    // Normalize to finder-local coordinates (0..6), accounting for mirroring.
    const lx = x >= cellCount - 7 ? cellCount - 1 - x : x;
    const ly = y >= cellCount - 7 ? cellCount - 1 - y : y;
    const edge = lx === 0 || lx === 6 || ly === 0 || ly === 6;
    const core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
    if (edge) return "solid";
    if (core) return "solid";
    return "hole";
  };

  const cells: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < cellCount; y++) {
    for (let x = 0; x < cellCount; x++) {
      const finder = isFinder(x, y);
      if (finder === "solid") {
        cells.push({ x, y });
      } else if (finder === null && rand() > 0.5) {
        cells.push({ x, y });
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="Ticket check-in code"
    >
      <rect width={size} height={size} fill="white" rx={8} />
      {cells.map((c) => (
        <rect
          key={`${c.x}-${c.y}`}
          x={c.x * cell}
          y={c.y * cell}
          width={cell}
          height={cell}
          fill="#10121C"
        />
      ))}
    </svg>
  );
}
