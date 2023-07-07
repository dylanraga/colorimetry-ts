/**
 * Simple pure gamma power function
 */
import { evenFn } from "../common/util.js";
import { ToneResponseCurve } from "./index.js";

type GammaTransferProps = {
  whiteLuminance: number;
  blackLuminance: number;
  gamma: number;
};

const defaults: GammaTransferProps = {
  whiteLuminance: 1,
  blackLuminance: 0,
  gamma: 2.2,
};

export const gammaCurve = (gamma = defaults.gamma): ToneResponseCurve<GammaTransferProps> => ({
  id: "gamma" + gamma,
  name: "Gamma " + gamma,
  eotf: (V, { whiteLuminance = defaults.whiteLuminance, blackLuminance = defaults.blackLuminance } = defaults) => {
    const f = (x: number) => x ** gamma;

    const L = (whiteLuminance - blackLuminance) * evenFn(f)(V) + blackLuminance;
    return L;
  },
  invEotf: (L, { whiteLuminance = defaults.whiteLuminance, blackLuminance = defaults.blackLuminance } = defaults) => {
    const f = (x: number) => x ** (1 / gamma);

    const V = evenFn(f)((L - blackLuminance) / (whiteLuminance - blackLuminance));
    return V;
  },
});

export const gamma1p8 = gammaCurve(1.8);
export const gamma2p2 = gammaCurve(2.2);
export const gamma2p4 = gammaCurve(2.4);
export const gamma2p6 = gammaCurve(2.6);
