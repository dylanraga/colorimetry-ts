/**
 * Hybrid-Log Gamma / ARIB STD-B67
 */

import { ToneResponseCurve } from "./index.js";

const a = 0.17883277;
const b = 0.28466892;
const c = 0.559910729529562;

type HlgTransferProps = {
  peakLuminance: number;
  whiteLuminance: number;
  blackLuminance: number;
  sceneLuminance: number;
  gamma: number;
};

const defaults: HlgTransferProps = {
  peakLuminance: 1000,
  whiteLuminance: 203,
  blackLuminance: 0,
  sceneLuminance: 203,
  gamma: 1.2,
};

export const hlgCurve = (gamma = defaults.gamma): ToneResponseCurve<HlgTransferProps> => ({
  id: "hlg",
  name: "HLG",

  eotf: (
    V,
    { peakLuminance = defaults.peakLuminance, blackLuminance = defaults.blackLuminance, sceneLuminance } = defaults,
  ) => {
    const _gamma = gamma + 0.42 * Math.log10(peakLuminance / 1000);
    const beta = Math.sqrt(3 * (blackLuminance / peakLuminance) ** (1 / _gamma));

    const f = (x: number) => (x > 1 / 2 ? (Math.exp((x - c) / a) + b) / 12 : (x * x) / 3);
    const E = f(Math.max(0, V * (1 - beta) + beta));
    const Ys = sceneLuminance ?? E;
    const L = peakLuminance * Ys ** (_gamma - 1) * E;

    // return Number(L.toPrecision(8));
    return L;
  },

  invEotf: (
    L,
    { peakLuminance = defaults.peakLuminance, blackLuminance = defaults.blackLuminance, sceneLuminance } = defaults,
  ) => {
    const _gamma = gamma + 0.42 * Math.log10(peakLuminance / 1000);
    // const beta = Math.sqrt(3 * (blackLuminance / peakLuminance) ** (1 / _gamma));

    const Yd = sceneLuminance ?? L;
    const E = (Yd / peakLuminance) ** ((1 - _gamma) / _gamma) * (L / peakLuminance);
    const V = E > 1 / 12 ? a * Math.log(12 * E - b) + c : Math.sqrt(E * 3);
    // V = Math.max(0, (+V.toPrecision(8) - beta) / (1 - beta));
    // V = Math.max(0, (V - beta) / (1 - beta));

    return V;
  },
});

export const hlg = hlgCurve(1.2);
