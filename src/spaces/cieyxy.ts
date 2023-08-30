//
// CIE Yxy 1931
//

import { ColorSpace } from "../space.js";
import { xyz } from "./xyz.js";

export const yxy = new ColorSpace({
  name: "CIE Yxy",
  keys: ["Y", "x", "y"],
  conversions: [
    {
      spaceB: xyz,
      aToB: xyzFromYxy,
      bToA: yxyFromXyz,
    },
  ],
});

/**
 * CIE1931 Yxy<->XYZ conversion functions
 */
export function xyzFromYxy([Y, x, y]: [number, number, number]): [number, number, number] {
  const X = (x * Y) / y;
  const Z = ((1 - x - y) * Y) / y;

  return [X, Y, Z];
}

export function yxyFromXyz([X, Y, Z]: [number, number, number]): [number, number, number] {
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
