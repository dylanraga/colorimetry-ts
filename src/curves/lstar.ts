/**
 * CIELab L*
 * http://www.brucelindbloom.com/index.html?Eqn_Luv_to_XYZ.html
 */
import { evenFn } from "../common/util.js";
import { ToneResponseCurve } from "./index.js";

const κ = 24389 / 27;
const ϵ = 216 / 24389;
const d = 6 / 29;

type LStarTransferProps = {
  whiteLuminance: number;
  blackLuminance: number;
};

const defaults: LStarTransferProps = {
  whiteLuminance: 1,
  blackLuminance: 0,
};

export const lstar: ToneResponseCurve<LStarTransferProps> = {
  id: "lstar",
  name: "L*",

  eotf: (V, { whiteLuminance = defaults.whiteLuminance, blackLuminance = defaults.blackLuminance } = defaults) => {
    const f = (x: number) => (x > d ? ((x + 16) / 116) ** 3 : x / κ);
    const L = (whiteLuminance - blackLuminance) * evenFn(f)(100 * V) + blackLuminance;
    return L;
  },

  invEotf: (L, { whiteLuminance = defaults.whiteLuminance, blackLuminance = defaults.blackLuminance } = defaults) => {
    const f = (x: number) => (x > ϵ ? 116 * Math.cbrt(x) - 16 : κ * x);
    const V = evenFn(f)((L - blackLuminance) / (whiteLuminance - blackLuminance)) / 100;
    return V;
  },
};
