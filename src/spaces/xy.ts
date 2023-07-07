/**
 * 1931 CIE xy chromaticity definitions and conversions
 */

import { ColorSpace } from "../space.js";
import { xyz } from "./xyz.js";

export const xy = new ColorSpace({
  name: "CIExy",
  keys: ["x", "y"],
  conversions: [
    {
      spaceB: xyz,
      aToB: xyToXyz,
      bToA: xyzToXy,
    },
  ],
});

export function xyzToXy([X, Y, Z]: number[]) {
  const denom = X + Y + Z;
  const x = X / denom;
  const y = Y / denom;

  return [x, y];
}

export function xyToXyz([x, y]: number[], { whiteLuminance = 1 }: { whiteLuminance?: number }) {
  const X = (whiteLuminance * x) / y;
  const Z = (whiteLuminance * (1 - x - y)) / y;

  return [X, whiteLuminance, Z];
}

export interface xy {
  x: number;
  y: number;
}
