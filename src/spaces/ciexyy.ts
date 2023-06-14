/**
 * 1931 CIE Yxy definitions and conversions
 */

import { ColorSpace } from "../space.js";
import { xyz } from "./xyz.js";

export const xyy = new ColorSpace({
  name: "CIExyY",
  keys: ["x", "y", "Y"],
  conversions: [
    {
      spaceB: xyz,
      aToB: xyyToXyz,
      bToA: xyzToXyy,
    },
  ],
});

/**
 * CIE1931 Yxy<->XYZ conversion functions
 */
export function xyyToXyz([x, y, Y]: number[]) {
  const X = (x * Y) / y;
  const Z = ((1 - x - y) * Y) / y;

  return [X, Y, Z];
}

export function xyzToXyy([X, Y, Z]: number[]) {
  const denom = X + Y + Z;
  const x = X / denom;
  const y = Y / denom;

  return [x, y, Y];
}

export interface xyY {
  x: number;
  y: number;
  Y: number;
}
