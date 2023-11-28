//
// CIE Yxy 1931
//

import { ColorSpace } from "../space.js";
import { xyz } from "./xyz.js";

const yxySpace = new ColorSpace({
  id: "cieyxy",
  name: "CIE Yxy",
  keys: ["Y", "x", "y"],
  conversions: [
    {
      spaceB: xyz(),
      aToB: xyzFromYxy,
      bToA: yxyFromXyz,
    },
  ],
});

export const yxy = (context?: object) => yxySpace;

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
