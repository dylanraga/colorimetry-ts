/**
 * Hybrid-Log Gamma / Rec.2100 / ARIB STD-B67
 */

import { ToneResponseCurve } from "./trc.js";

const a = 0.17883277;
const b = 0.28466892;
const c = 0.559910729529562;

const defaults = {
  peakLuminance: 100,
  whiteLuminance: 203,
  blackLuminance: 0,
  gamma: 1.2,
};

export const hlg: ToneResponseCurve<{
  peakLuminance: number;
  blackLuminance: number;
  gamma: number;
}> = {
  id: "hlg",
  name: "HLG",
  eotf: (
    V,
    {
      peakLuminance = defaults.peakLuminance,
      blackLuminance = defaults.blackLuminance,
      gamma = defaults.gamma,
    } = defaults
  ) => {
    const _gamma = gamma + 0.42 * Math.log10(peakLuminance / 1000);
    const beta = Math.sqrt(3 * (blackLuminance / peakLuminance) ** (1 / _gamma));

    const f = (x: number) => (x > 1 / 2 ? (Math.exp((x - c) / a) + b) / 12 : (x * x) / 3);
    const E = f(Math.max(0, V * (1 - beta) + beta));
    const L = peakLuminance * E ** _gamma;

    return Number(L.toPrecision(8));
  },
  invEotf: (
    L,
    {
      peakLuminance = defaults.peakLuminance,
      blackLuminance = defaults.blackLuminance,
      gamma = defaults.gamma,
    } = defaults
  ) => {
    const _gamma = gamma + 0.42 * Math.log10(peakLuminance / 1000);
    const beta = Math.sqrt(3 * (blackLuminance / peakLuminance) ** (1 / _gamma));

    const E = (L / peakLuminance) ** (1 / _gamma);
    let V = E > 1 / 12 ? a * Math.log(12 * E - b) + c : Math.sqrt(E * 3);
    V = Math.max(0, (+V.toPrecision(8) - beta) / (1 - beta));

    return V;
  },
};
