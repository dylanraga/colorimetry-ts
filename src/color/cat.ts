import { illuminants } from "../../colorimetry.js";
import { Color } from "../color.js";
import { minv, mmult3333, mmult3331 } from "../common/util.js";
import { Yxy, xyzFromYxy } from "../spaces/cieyxy.js";
import { xy, xyzFromXy } from "../spaces/xy.js";
import { xyz as xyzSpace } from "../spaces/xyz.js";

export type ChromaticAdaptationMethodName = "xyz" | "vonkries" | "bradford" | "cat02" | "cat16";

// Von Kries
export const mVonKries = [
  [0.40024, 0.7076, -0.08081],
  [-0.2263, 1.16532, 0.0457],
  [0.0, 0.0, 0.91822],
];

// Bradford
export const mBradford = [
  [0.8951, 0.2664, -0.1614],
  [-0.7502, 1.7135, 0.0367],
  [0.0389, -0.0685, 1.0296],
];

// CAT02
//----

// CAT16
//----

const catMethodMtxMap: Record<string, number[][]> = {
  vonkries: mVonKries,
  bradford: mBradford,
};

function xyzScale([X, Y, Z]: [number, number, number], refWhiteSrc: Yxy, refWhiteDst: Yxy): [number, number, number] {
  const [Xws, , Zws] = xyzFromXy([refWhiteSrc.x, refWhiteSrc.y], refWhiteSrc.Y);
  const [Xwd, , Zwd] = xyzFromXy([refWhiteDst.x, refWhiteDst.y], refWhiteDst.Y);
  return [(X * Xwd) / Xws, (Y * refWhiteDst.Y) / refWhiteSrc.Y, (Z * Zwd) / Zws];
}

export function xyzCat(
  xyzSrc: [number, number, number],
  refWhiteSrc: Yxy,
  refWhiteDst: Yxy,
  method: ChromaticAdaptationMethodName = "bradford"
): [number, number, number] {
  if (method === "xyz") {
    return xyzScale(xyzSrc, refWhiteSrc, refWhiteDst);
  }

  const MA = catMethodMtxMap[method];

  const [ρS, γS, βS] = mmult3331(MA, xyzFromYxy([refWhiteSrc.x, refWhiteSrc.y, refWhiteSrc.Y]));
  const [ρD, γD, βD] = mmult3331(MA, xyzFromYxy([refWhiteDst.x, refWhiteDst.y, refWhiteDst.Y]));

  const M1 = [
    [ρD / ρS, 0, 0],
    [0, γD / γS, 0],
    [0, 0, βD / βS],
  ];
  const M2 = mmult3333(minv(MA), mmult3333(M1, MA));
  const xyzDst = mmult3331(M2, xyzSrc);

  return xyzDst;
}

function _cat(
  this: Color,
  {
    refWhiteSrc = illuminants.d65,
    refWhiteDst,
    method = "bradford",
  }: { refWhiteSrc?: xy; refWhiteDst: xy; method?: ChromaticAdaptationMethodName }
) {
  const xyz = this.toSpace(xyzSpace).values;
  return new Color(xyzSpace, xyzCat(xyz, { Y: 1, ...refWhiteSrc }, { Y: 1, ...refWhiteDst }, method)).toSpace(
    this.space
  );
}

declare module "../color" {
  interface Color {
    cat: typeof _cat;
  }
}

Color.prototype.cat = _cat;
