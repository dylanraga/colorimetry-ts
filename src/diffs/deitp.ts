import { deg2rad, rad2deg } from "../common/util.js";
import { ColorDifferenceMethod } from "../diff.js";
import { itp_lch, itp as itpSpace } from "../spaces/ictcp.js";

// DE_ITP = 1/720 equates to a JND
export const itp: ColorDifferenceMethod<{
  excludeLuminance?: boolean;
  scalar?: 240 | 720 | 1440;
}> = (colorA, colorB, options = {}) => {
  const { scalar = 720, excludeLuminance = false } = options;
  const [I1, T1, P1] = colorA.toSpace(itpSpace).values;
  const [I2, T2, P2] = colorB.toSpace(itpSpace).values;

  const dI = I1 - I2;
  const dT = T1 - T2;
  const dP = P1 - P2;

  const dEITP = scalar * Math.sqrt((!excludeLuminance ? dI * dI : 0) + dT * dT + dP * dP);
  return dEITP;
};

export const itp_c: ColorDifferenceMethod<{
  scalar?: 240 | 720 | 1440;
}> = (colorA, colorB, options = {}) => {
  const { scalar = 720 } = options;
  const [, C1] = colorA.toSpace(itp_lch).values;
  const [, C2] = colorB.toSpace(itp_lch).values;

  const dC = C1 - C2;

  return scalar * dC;
};

export const itp_h: ColorDifferenceMethod<{
  scalar?: 240 | 720 | 1440;
}> = (colorA, colorB, options = {}) => {
  const { scalar = 720 } = options;
  const [, C1, h1] = colorA.toSpace(itp_lch).values;
  const [, C2, h2] = colorB.toSpace(itp_lch).values;

  const dH = 2 * Math.sqrt(C1 * C2) * Math.sin(deg2rad((h2 - h1) / 2));

  return scalar * dH;
};
