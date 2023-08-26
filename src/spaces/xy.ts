/**
 * 1931 CIE xy chromaticity definitions and conversions
 */

import { ColorSpace } from "../space.js";
import { xyz } from "./xyz.js";

const xyContext = { whiteLuminance: 1 } as const;

export const xy = Object.assign(
  new ColorSpace({
    name: "CIExy",
    keys: ["x", "y"],
    conversions: [
      {
        spaceB: xyz,
        aToB: (values, newContext) => xyToXyz(values, Object.assign(xyContext, newContext)),
        bToA: xyzToXy,
      },
    ],
  }),
  xyContext
);

export function xyzToXy([X, Y, Z]: number[]) {
  const denom = X + Y + Z;
  const x = X / denom;
  const y = Y / denom;

  return [x, y];
}

export function xyToXyz([x, y]: number[], { whiteLuminance = 1 }: { whiteLuminance?: number } = { whiteLuminance: 1 }) {
  const X = (whiteLuminance * x) / y;
  const Z = (whiteLuminance * (1 - x - y)) / y;

  return [X, whiteLuminance, Z];
}

export interface xy {
  x: number;
  y: number;
}
