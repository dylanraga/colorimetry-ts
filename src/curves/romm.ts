/**
 * Kodak ProPhoto / ROMM
 */
import { evenFn } from "../common/util.js";
import { ToneResponseCurve } from "../curves.js";

const Et = 1 / 512;

interface RommTransferProps {
  whiteLuminance: number;
  blackLuminance: number;
}

const defaults: RommTransferProps = {
  whiteLuminance: 1,
  blackLuminance: 0,
};

export const romm: ToneResponseCurve<RommTransferProps> = {
  id: "romm",
  name: "ROMM",

  eotf: (V, { whiteLuminance = defaults.whiteLuminance, blackLuminance = defaults.blackLuminance } = defaults) => {
    const f = (x: number) => (x < 16 * Et ? Math.max(0, x / 16) : Math.min(1, x ** 1.8));

    const L = (whiteLuminance - blackLuminance) * evenFn(f)(V) + blackLuminance;
    return L;
  },

  invEotf: (L, { whiteLuminance = defaults.whiteLuminance, blackLuminance = defaults.blackLuminance } = defaults) => {
    const f = (x: number) => (x < Et ? Math.max(0, 16 * x) : Math.min(1, x ** (1 / 1.8)));

    const V = evenFn(f)((L - blackLuminance) / (whiteLuminance - blackLuminance));
    return V;
  },
};
