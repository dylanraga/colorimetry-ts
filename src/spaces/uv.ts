/**
 * 1976 CIE u'v' chromaticity definitions and conversions
 */

import { ColorSpace } from "../space.js";
import { xy } from "./xy.js";
import { xyz } from "./xyz.js";

export const uv = new ColorSpace({
  name: "CIEu'v'",
  keys: ["u", "v"],
  conversions: [
    {
      spaceB: xyz,
      aToB: uvToXyz,
      bToA: xyzToUv,
    },
    {
      spaceB: xy,
      aToB: uvToXy,
      bToA: xyToUv,
    },
  ],
});

export function xyzToUv([X, Y, Z]: number[]) {
  const denom = X + 15 * Y + 3 * Z;
  const u = (4 * X) / denom;
  const v = (9 * Y) / denom;

  return [u, v];
}

export function uvToXyz([u, v]: number[], { whiteLuminance = 1 }: { whiteLuminance?: number }) {
  const denom = 4 * v;
  const X = (whiteLuminance * (9 * u)) / denom;
  const Z = (whiteLuminance * (12 - 3 * u - 20 * v)) / denom;

  return [X, whiteLuminance, Z];
}

export function xyToUv([x, y]: number[]): number[] {
  const denom = -2 * x + 12 * y + 3;

  return [(4 * x) / denom, (9 * y) / denom];
}

export function uvToXy([u, v]: number[]): number[] {
  const denom = 6 * u - 16 * v + 12;

  return [(9 * u) / denom, (4 * v) / denom];
}

export interface uv {
  u: number;
  v: number;
}
