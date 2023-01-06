/**
 * ST.2084 HDR / Rec.2100
 * TODO: Add tonemap knee w.r.t whiteLuminance & blackLuminance
 */
import { ToneResponseCurve } from "./trc.js";

const m1 = 0.1593017578125;
const m2 = 78.84375;
const c1 = 0.8359375;
const c2 = 18.8515625;
const c3 = 18.6875;

const defaults = {
  peakLuminance: 10000,
  blackLuminance: 0,
  m2,
};

export const st2084: ToneResponseCurve<{
  peakLuminance: number;
  blackLuminance: number;
  m2: number;
}> = {
  id: "st2084",
  name: "Dolby PQ (ST.2084)",
  eotf: (
    V,
    { peakLuminance = defaults.peakLuminance, blackLuminance = defaults.blackLuminance, m2 = defaults.m2 } = defaults
  ) => {
    const L = peakLuminance * (Math.max(V ** (1 / m2) - c1, 0) / (c2 - c3 * V ** (1 / m2))) ** (1 / m1);
    //return Math.max(Math.min(L, whiteLuminance), blackLuminance);
    return L;
  },
  invEotf: (
    L,
    { peakLuminance = defaults.peakLuminance, blackLuminance = defaults.blackLuminance, m2 = defaults.m2 } = defaults
  ) => {
    const V = ((c1 + c2 * (L / peakLuminance) ** m1) / (1 + c3 * (L / peakLuminance) ** m1)) ** m2;
    return V;
  },
};
