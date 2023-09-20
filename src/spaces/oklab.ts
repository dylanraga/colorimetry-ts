//
// Oklab by Björn Ottosson
//

import { memoize, minv, mmult3331 as mmult } from "../common/util.js";
import { ColorSpace, fnSpace } from "../space.js";
import { lchSpaceFromLabSpace } from "./lch.js";
import { xyz, xyzNToXyz, xyzToXyzN } from "./xyz.js";

type OklabColorSpaceContext = {
  whiteLuminance: number;
};

export const oklabSpace = memoize((context: OklabColorSpaceContext) =>
  Object.assign(
    new ColorSpace({
      name: "Oklab",
      keys: ["L", "a", "b"],
      conversions: [
        {
          spaceB: xyz(),
          aToB: (values) => oklabToXyz(values, context),
          bToA: (values) => xyzToOklab(values, context),
        },
      ],
      // precision: 3,
    }),
    context
  )
);

export const oklab = fnSpace(oklabSpace, { whiteLuminance: 100 });

export const oklch: typeof oklab = (context) =>
  lchSpaceFromLabSpace(oklab(context), { name: "Oklch", keys: ["L", "C", "h"] });

/**
 * XYZ <-> Oklab conversion functions
 */
/*
const M1 = [
	[0.8189330101, 0.3618667424, -0.1288597137],
	[0.0329845436, 0.9293118715, 0.0361456387],
	[0.0482003018, 0.2643662691, 0.633851707],
];
*/
// back-derived from Ottosson's srgb linear -> lms matrices
const M1 = [
  [0.81890877949647, 0.361970192244032, -0.128852020359168],
  [0.032920040124572, 0.929329048497921, 0.03616405796002],
  [0.048153741830959, 0.26424595067311, 0.633613465073842],
];
const M1Inv = minv(M1);

const M2 = [
  [0.2104542553, 0.793617785, -0.0040720468],
  [1.9779984951, -2.428592205, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.808675766],
];
const M2Inv = minv(M2);

function xyzToOklab(
  XYZ: [number, number, number],
  { whiteLuminance }: { whiteLuminance: number }
): [number, number, number] {
  const XnYnZn = xyzToXyzN(XYZ, whiteLuminance);
  const LMS = mmult(M1, XnYnZn);
  const LpMpSp = LMS.map(Math.cbrt);
  const Lab = mmult(M2, LpMpSp);

  return Lab;
}

function oklabToXyz(
  Lab: [number, number, number],
  { whiteLuminance }: { whiteLuminance: number }
): [number, number, number] {
  const LpMpSp = mmult(M2Inv, Lab);
  const LMS = LpMpSp.map((u) => u * u * u);
  const XnYnZn = mmult(M1Inv, LMS);
  const XYZ = xyzNToXyz(XnYnZn, whiteLuminance);

  return XYZ;
}
