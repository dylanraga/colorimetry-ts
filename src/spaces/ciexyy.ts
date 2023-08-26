/**
 * 1931 CIE Yxy definitions and conversions
 */

import { ColorSpace } from "../space.js";
import { xyz } from "./xyz.js";

export const yxy = new ColorSpace({
  name: "CIE Yxy",
  keys: ["Y", "x", "y"],
  conversions: [
    {
      spaceB: xyz,
      aToB: yxyToXyz,
      bToA: xyzToYxy,
    },
  ],
});

/**
 * CIE1931 Yxy<->XYZ conversion functions
 */
export function yxyToXyz([Y, x, y]: number[]) {
  const X = (x * Y) / y;
  const Z = ((1 - x - y) * Y) / y;

  return [X, Y, Z];
}

export function xyzToYxy([X, Y, Z]: number[]) {
  const denom = X + Y + Z;
  const x = X / denom;
  const y = Y / denom;

  return [Y, x, y];
}

export interface Yxy {
  Y: number;
  x: number;
  y: number;
}
