/**
 * CIE chromaticity Y-xy 1931
 */

import { ColorSpace } from "../space.js";
import { xyz } from "./xyz.js";

export const xy = new ColorSpace({
  name: "CIE Y-xy",
  keys: ["Y", "x", "y"],
  conversions: [
    {
      spaceB: xyz,
      aToB: (values) => xyzFromXy(values.slice(1, 3) as [number, number], values[0]),
      bToA: (values) => [values[1]].concat(xyFromXyz(values)) as [number, number, number],
    },
  ],
});

export function xyFromXyz([X, Y, Z]: [number, number, number]): [number, number] {
  const denom = X + Y + Z;
  const x = X / denom;
  const y = Y / denom;

  return [x, y];
}

export function xyzFromXy([x, y]: [number, number], whiteLuminance = 1): [number, number, number] {
  const X = (whiteLuminance * x) / y;
  const Z = (whiteLuminance * (1 - x - y)) / y;

  return [X, whiteLuminance, Z];
}

export interface xy {
  x: number;
  y: number;
}
