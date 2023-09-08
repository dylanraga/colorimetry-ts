/**
 * ST.2084 / Dolby Perceptual Quantizer
 * TODO: Add EETF BT.2390
 */
import { ToneResponseCurve } from "./index.js";

const m1 = 0.1593017578125;
const m2 = 78.84375;
const c1 = 0.8359375;
const c2 = 18.8515625;
const c3 = 18.6875;

type St2084TransferProps = {
  peakLuminance: number;
  blackLuminance: number;
  m2: number;
};

const defaults: St2084TransferProps = {
  peakLuminance: 10000,
  blackLuminance: 0.0001,
  m2,
};

export const st2084: ToneResponseCurve<St2084TransferProps> = {
  id: "st2084",
  name: "SMPTE ST 2084",
  eotf: (
    V,
    { peakLuminance = defaults.peakLuminance, blackLuminance = defaults.blackLuminance, m2 = defaults.m2 } = defaults
  ) => {
    const L = 10000 * (Math.max(V ** (1 / m2) - c1, 0) / (c2 - c3 * V ** (1 / m2))) ** (1 / m1);
    // return Math.max(Math.min(L, peakLuminance), blackLuminance);
    return L;
  },
  invEotf: (
    L,
    { peakLuminance = defaults.peakLuminance, blackLuminance = defaults.blackLuminance, m2 = defaults.m2 } = defaults
  ) => {
    const V = ((c1 + c2 * (L / 10000) ** m1) / (1 + c3 * (L / 10000) ** m1)) ** m2;
    return V;
  },
};
