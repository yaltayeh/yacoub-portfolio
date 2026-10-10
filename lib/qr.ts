import { encode } from "uqr";

export type QrOptions = {
  /** Quiet zone in modules (the QR spec asks for 4; 2 is fine on a white card). */
  margin?: number;
  dark?: string;
  light?: string;
};

/**
 * A QR code as a standalone SVG string, error correction level M.
 * One <path> with a rectangle per run of dark modules keeps the file small
 * and prints crisply at any size.
 */
export function qrSvg(text: string, { margin = 2, dark = "#0c0627", light = "#ffffff" }: QrOptions = {}): string {
  const { data, size } = encode(text, { ecc: "M", border: 0 });
  const total = size + margin * 2;
  let d = "";
  data.forEach((row, y) => {
    let x = 0;
    while (x < size) {
      if (!row[x]) {
        x++;
        continue;
      }
      const start = x;
      while (x < size && row[x]) x++;
      d += `M${start + margin} ${y + margin}h${x - start}v1h-${x - start}z`;
    }
  });
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges">` +
    `<rect width="${total}" height="${total}" fill="${light}"/>` +
    `<path fill="${dark}" d="${d}"/></svg>`
  );
}

/** QR version and module count, for checking a code stays small. */
export function qrInfo(text: string): { version: number; size: number } {
  const { version, size } = encode(text, { ecc: "M", border: 0 });
  return { version, size };
}
