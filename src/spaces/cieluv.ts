//
// CIELUV 1976
//

import { memoize } from "../common/util.js";
import { lstar } from "../curves/lstar.js";
import { illuminants } from "../illuminants/index.js";
import { ColorSpace, fnSpace } from "../space.js";
import { lchSpaceFromLabSpace } from "./lch.js";
import { uvFromXy, uvFromXyz, xyzFromUv } from "./uv.js";
import { xy } from "./xy.js";
import { xyz } from "./xyz.js";

type LuvColorSpaceContext = {
  refWhite: xy;
  whiteLuminance: number;
};

const luvSpace = memoize((context: LuvColorSpaceContext) =>
  Object.assign(
    new ColorSpace({
      id: "cieluv",
      name: "CIELUV",
      keys: ["L", "U", "V"],
      conversions: [
        {
          spaceB: xyz(),
          aToB: (values) => xyzFromCieluv(values, context),
          bToA: (values) => cieluvFromXyz(values, context),
        },
      ],
    }),
    context,
  ),
);

export const luv = fnSpace(luvSpace, { refWhite: illuminants.d65, whiteLuminance: 100 });

export const luv_lch: typeof luv = (context) => lchSpaceFromLabSpace(luv(context));

/*
 * CIELUV/u'v' <-> XYZ conversions
 */

export function cieluvFromXyz(
  [X, Y, Z]: number[],
  { refWhite, whiteLuminance }: { refWhite: xy; whiteLuminance: number },
): [number, number, number] {
  const [ur, vr] = uvFromXy([refWhite.x, refWhite.y]);
  const [u, v] = uvFromXyz([X, Y, Z]);
  const L = 100 * lstar.invEotf(Y, { whiteLuminance });
  const U = 13 * L * (u - ur);
  const V = 13 * L * (v - vr);

  return [L, U, V];
}

export function xyzFromCieluv(
  [L, U, V]: number[],
  { refWhite, whiteLuminance }: { refWhite: xy; whiteLuminance: number },
): [number, number, number] {
  const [ur, vr] = uvFromXy([refWhite.x, refWhite.y]);
  const u = U / (13 * L) + ur;
  const v = V / (13 * L) + vr;
  const Yn = lstar.eotf(L / 100, { whiteLuminance });
  const [Xn, , Zn] = xyzFromUv([u, v], Yn);

  return [Xn, Yn, Zn];
}
