/**
 * ACEScc
 * https://docs.acescentral.com/specifications/acescc/
 */
import { ToneResponseCurve } from "../curves.js";

export const acescc: ToneResponseCurve = {
  id: "acescc",
  name: "ACEScc",

  eotf: (V) => {
    return V <= (9.72 - 15) / 17.52
      ? (2 ** (V * 17.52 - 9.72) - 2e-16) * 2
      : V < (Math.log2(65504) + 9.72) / 17.52
      ? 2 ** (V * 17.52 - 9.72)
      : 65504;
  },

  invEotf: (L) => {
    return L <= 0
      ? (Math.log2(2e-16) + 9.72) / 17.52
      : L < 2e-15
      ? (Math.log2(2e-16 + L * 0.5) + 9.72) / 17.52
      : (Math.log2(L) + 9.72) / 17.52;
  },
};
