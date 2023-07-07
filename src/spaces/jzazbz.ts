/**
 * JzAzBz definitions and conversions
 * --------------------------------
 */

import { minv, mmult3331 } from "../common/util.js";
import { st2084 } from "../curves/st2084.js";
import { ColorSpace } from "../space.js";
import { lchSpace } from "./lch.js";
import { xyz } from "./xyz.js";

export const jzazbz = new ColorSpace({
  name: "Jzazbz",
  keys: ["Jz", "az", "bz"],
  conversions: [
    {
      spaceB: xyz,
      aToB: jzazbzToXyz,
      bToA: xyzToJzazbz,
    },
  ],
  // precision: 6,
});

export const jzczhz = lchSpace(jzazbz, { name: "JzCzhz", keys: ["J", "C", "h"] });

/*
 * JzAzBz <-> XYZ conversions
 */
const b = 1.15;
const g = 0.66;
const d = -0.56;
const d0 = 1.629549953282157e-11;

const mXpYpZp_to_LMS = [
  [0.41478972, 0.579999, 0.014648],
  [-0.20151, 1.120649, 0.0531008],
  [-0.0166008, 0.2648, 0.6684799],
];
const mLMS_to_XpYpZp = minv(mXpYpZp_to_LMS);

const mLMS_to_IAB = [
  [0.5, 0.5, 0.0],
  [3.524, -4.066708, 0.542708],
  [0.199076, 1.096799, -1.295875],
];
const mIAB_to_LMS = minv(mLMS_to_IAB);
// const jabTrc = curves.st2084.props({ m2: 134.034375 });

function xyzToJzazbz([X, Y, Z]: number[]) {
  const Xp = b * X - (b - 1) * Z;
  const Yp = g * Y - (g - 1) * X;

  const LMS = mmult3331(mXpYpZp_to_LMS, [Xp, Yp, Z]);
  const LMSp = LMS.map((u) => st2084.invEotf(u, { m2: 134.034375 }));
  const [Iz, az, bz] = mmult3331(mLMS_to_IAB, LMSp);

  const Jz = ((1 + d) * Iz) / (1 + d * Iz) - d0;

  return [Jz, az, bz];
}

function jzazbzToXyz([Jz, az, bz]: number[]) {
  const Jz_ = Jz + d0;
  const Iz = Jz_ / (1 + d - d * Jz_);

  const LMSp = mmult3331(mIAB_to_LMS, [Iz, az, bz]);
  const LMS = LMSp.map((u) => st2084.eotf(u, { m2: 134.034375 }));
  const [Xp, Yp, Zp] = mmult3331(mLMS_to_XpYpZp, LMS);

  const X = (1 / b) * (Xp + (b - 1) * Zp);
  const Y = (1 / g) * (Yp + (g - 1) * X);

  return [X, Y, Zp];
}
