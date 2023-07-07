/**
 * CIELuv definitions and conversions
 */

import { lstar } from "../curves/lstar.js";
import { illuminants } from "../illuminants/index.js";
import { ColorSpace } from "../space.js";
import { uvToXyz, xyToUv, xyzToUv } from "./uv.js";
import { xy } from "./xy.js";
import { xyz } from "./xyz.js";

export const luv = new ColorSpace<{ refWhite: xy; whiteLuminance: number }>({
  name: "CIELUV",
  keys: ["L*", "u*", "v*"],
  conversions: [
    {
      spaceB: xyz,
      aToB: (values, props) => cieluvToXyz(values, { refWhite: illuminants.d65, whiteLuminance: 100, ...props }),
      bToA: (values, props) => xyzToCieluv(values, { refWhite: illuminants.d65, whiteLuminance: 100, ...props }),
    },
  ],
});

/*
 * CIELUV/u'v' <-> XYZ conversions
 */

export function xyzToCieluv(
  [X, Y, Z]: number[],
  { refWhite, whiteLuminance }: { refWhite: xy; whiteLuminance: number }
) {
  const [ur, vr] = xyToUv([refWhite.x, refWhite.y]);
  const [u, v] = xyzToUv([X, Y, Z]);
  const L = 100 * lstar.invEotf(Y, { whiteLuminance });
  const U = 13 * L * (u - ur);
  const V = 13 * L * (v - vr);

  return [L, U, V];
}

export function cieluvToXyz(
  [L, U, V]: number[],
  { refWhite, whiteLuminance }: { refWhite: xy; whiteLuminance: number }
) {
  const [ur, vr] = xyToUv([refWhite.x, refWhite.y]);
  const u = U / (13 * L) + ur;
  const v = V / (13 * L) + vr;
  const Yn = lstar.eotf(L / 100, { whiteLuminance });
  const [Xn, , Zn] = uvToXyz([u, v], { whiteLuminance: Yn });

  return [Xn, Yn, Zn];
}
