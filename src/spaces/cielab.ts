//
// CIELAB 1976
// ----------------------------
// Use illuminant D50 since CIELAB was intended for reflective surfaces, not emissive displays.
// Currently using "wrong" Von Kries/XYZ scaling per spec; consider implementing manual Bradford CAT option in the future
//

import { memoize } from "../common/util.js";
import { lstar } from "../curves/lstar.js";
import { illuminants } from "../illuminants/index.js";
import { ColorSpace, fnSpace } from "../space.js";
import { lchSpaceFromLabSpace } from "./lch.js";
import { xy, xyzFromXy } from "./xy.js";
import { xyz } from "./xyz.js";

type LabColorSpaceContext = {
  refWhite: xy;
  whiteLuminance: number;
};

// const labContext: LabColorSpaceContext = { refWhite: illuminants.d65, whiteLuminance: 100 };
// export const lab = (context?: Partial<LabColorSpaceContext>) => cielabSpace({ ...labContext, ...context });

// const labD50Context: LabColorSpaceContext = { refWhite: illuminants.d50, whiteLuminance: 100 };
// export const labD50 = (context?: Partial<LabColorSpaceContext>) =>
//   cielabSpace({
//     ...labD50Context,
//     ...context,
//   });

export const cielabSpace = memoize((context: LabColorSpaceContext) =>
  Object.assign(
    new ColorSpace({
      id: "cielab",
      name: "CIELAB",
      keys: ["L", "a", "b"],
      conversions: [
        {
          spaceB: xyz(),
          aToB: (values) => xyzFromCielab(values, context),
          bToA: (values) => cielabFromXyz(values, context),
        },
      ],
    }),
    context,
  ),
);

export const lab = fnSpace(cielabSpace, { refWhite: illuminants.d65, whiteLuminance: 100 });
export const lab_d50 = fnSpace(cielabSpace, { refWhite: illuminants.d50, whiteLuminance: 100 });

// export const lch = (context?: Partial<LabColorSpaceContext>) => lchSpaceFromLabSpace(lab(context));
export const lch: typeof lab = (context) => lchSpaceFromLabSpace(lab(context));
// export const lchD50 = (context?: Partial<LabColorSpaceContext>) => lchSpaceFromLabSpace(labD50(context));

/*
 * CIELAB <-> XYZ conversion functions
 */
export function cielabFromXyz(
  [X, Y, Z]: [number, number, number],
  { refWhite, whiteLuminance }: { refWhite: xy; whiteLuminance: number },
): [number, number, number] {
  const [Xr, Yr, Zr] = xyzFromXy([refWhite.x, refWhite.y], whiteLuminance);

  const f = (x: number) => (100 * lstar.invEotf(x) + 16) / 116;
  const L = 116 * f(Y / Yr) - 16;
  const a = 500 * (f(X / Xr) - f(Y / Yr));
  const b = 200 * (f(Y / Yr) - f(Z / Zr));

  return [L, a, b];
}

export function xyzFromCielab(
  [L, a, b]: [number, number, number],
  { refWhite, whiteLuminance }: { refWhite: xy; whiteLuminance: number },
): [number, number, number] {
  const [Xr, Yr, Zr] = xyzFromXy([refWhite.x, refWhite.y], whiteLuminance);

  const fInv = (x: number) => lstar.eotf((116 * x - 16) / 100);
  const Lp = (L + 16) / 116;
  const X = Xr * fInv(Lp + a / 500);
  const Y = Yr * fInv(Lp);
  const Z = Zr * fInv(Lp - b / 200);

  return [X, Y, Z];
}
