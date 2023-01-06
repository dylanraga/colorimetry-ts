/**
 * Simple gamma power function
 */
import { evenFn } from "../common/util.js";
import { ToneResponseCurve } from "./trc.js";

const defaults = {
  whiteLuminance: 1,
  blackLuminance: 0,
  gamma: 2.2,
};

export const gamma = (
  gamma: number
): ToneResponseCurve<{
  whiteLuminance: number;
  blackLuminance: number;
  gamma: number;
}> => ({
  id: "gamma" + gamma,
  name: "Gamma Power " + gamma,
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

export const gamma2p2 = gamma(2.2);
export const gamma2p4 = gamma(2.4);
