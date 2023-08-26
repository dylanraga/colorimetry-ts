/**
 * CIELAB definitions and conversions
 * ----------------------------
 * Use illuminant D50 since CIELAB was intended for reflective surfaces, not emissive/transmissive displays.
 * Currently using "wrong" Von Kries/XYZ scaling per spec; consider implementing manual Bradford CAT option in the future
 */

import { lstar } from "../curves/lstar.js";
import { illuminants } from "../illuminants/index.js";
import { ColorSpace } from "../space.js";
import { lchSpaceFromLabSpace } from "./lch.js";
import { xy, xyToXyz } from "./xy.js";
import { xyz } from "./xyz.js";

export const lab = cielabSpace({ refWhite: illuminants.d65, whiteLuminance: 100 });
export const lab_d50 = cielabSpace({ refWhite: illuminants.d50, whiteLuminance: 100 });
export const lch = lchSpaceFromLabSpace(lab);
export const lch_d50 = lchSpaceFromLabSpace(lab_d50);

export function cielabSpace(context: { refWhite: xy; whiteLuminance: number }) {
  const newSpace = new ColorSpace({
    name: "CIELAB",
    keys: ["L", "a", "b"],
    conversions: [
      {
        spaceB: xyz,
        aToB: (values, newContext) => cielabToXyz(values, Object.assign(context, newContext)),
        bToA: (values, newContext) => xyzToCielab(values, Object.assign(context, newContext)),
      },
    ],
  });

  return Object.assign(newSpace, context);
}

/**
 * CIELAB <-> XYZ conversion functions
 */
export function xyzToCielab(
  [X, Y, Z]: number[],
  { refWhite, whiteLuminance }: { refWhite: xy; whiteLuminance: number }
) {
  const [Xr, Yr, Zr] = xyToXyz([refWhite.x, refWhite.y], { whiteLuminance });

  const f = (x: number) => (100 * lstar.invEotf(x) + 16) / 116;
  const L = 116 * f(Y / Yr) - 16;
  const a = 500 * (f(X / Xr) - f(Y / Yr));
  const b = 200 * (f(Y / Yr) - f(Z / Zr));

  return [L, a, b];
}

export function cielabToXyz(
  [L, a, b]: number[],
  { refWhite, whiteLuminance }: { refWhite: xy; whiteLuminance: number }
) {
  const [Xr, Yr, Zr] = xyToXyz([refWhite.x, refWhite.y], { whiteLuminance });

  const fInv = (x: number) => lstar.eotf((116 * x - 16) / 100);
  const Lp = (L + 16) / 116;
  const X = Xr * fInv(Lp + a / 500);
  const Y = Yr * fInv(Lp);
  const Z = Zr * fInv(Lp - b / 200);

  return [X, Y, Z];
}
