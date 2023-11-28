//
// CIE chromaticity Y-u'v' 1976
// (not to be confused with YUV)
//

import { ColorSpace } from "../space.js";
import { xy } from "./xy.js";
import { xyz } from "./xyz.js";

const uv76Space = new ColorSpace({
  id: "cieuv",
  name: "CIE Y-u'v'",
  keys: ["Y", "u'", "v'"],
  conversions: [
    {
      spaceB: xyz(),
      aToB: (values) => xyzFromUv(values.slice(1, 3) as [number, number], values[0]),
      bToA: (values) => [values[1]].concat(uvFromXyz(values)) as [number, number, number],
    },
    {
      spaceB: xy(),
      aToB: (values) =>
        [values[0]].concat(xyFromUv(values.slice(1, 3) as [number, number])) as [number, number, number],
      bToA: (values) =>
        [values[0]].concat(uvFromXy(values.slice(1, 3) as [number, number])) as [number, number, number],
    },
  ],
});

export const uv76 = (context?: object) => uv76Space;

//
// Conversion functions
//

export function uvFromXyz([X, Y, Z]: [number, number, number]): [number, number] {
  const denom = X + 15 * Y + 3 * Z;
  const u = (4 * X) / denom;
  const v = (9 * Y) / denom;

  return [u, v];
}

export function xyzFromUv([u, v]: [number, number], whiteLuminance = 1): [number, number, number] {
  const denom = 4 * v;
  const X = (whiteLuminance * (9 * u)) / denom;
  const Z = (whiteLuminance * (12 - 3 * u - 20 * v)) / denom;

  return [X, whiteLuminance, Z];
}

export function uvFromXy([x, y]: [number, number]): [number, number] {
  const denom = -2 * x + 12 * y + 3;

  return [(4 * x) / denom, (9 * y) / denom];
}

export function xyFromUv([u, v]: [number, number]): [number, number] {
  const denom = 6 * u - 16 * v + 12;

  return [(9 * u) / denom, (4 * v) / denom];
}

export interface uv {
  u: number;
  v: number;
}
