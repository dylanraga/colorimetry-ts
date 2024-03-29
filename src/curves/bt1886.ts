/**
 * ITU-R BT.1886
 */
import { evenFn } from "../common/util.js";
import { ToneResponseCurve } from "./index.js";

type Bt1886TransferProps = {
  whiteLuminance: number;
  blackLuminance: number;
  gamma: number;
};

const defaults: Bt1886TransferProps = {
  whiteLuminance: 1,
  blackLuminance: 0,
  gamma: 2.4,
};

export const bt1886: ToneResponseCurve<Bt1886TransferProps> = {
  id: "bt1886",
  name: "BT.1886",

  eotf: (
    V,
    {
      whiteLuminance = defaults.whiteLuminance,
      blackLuminance = defaults.blackLuminance,
      gamma = defaults.gamma,
    } = defaults,
  ) => {
    const a = (whiteLuminance ** (1 / gamma) - blackLuminance ** (1 / gamma)) ** gamma;
    const b = blackLuminance ** (1 / gamma) / (whiteLuminance ** (1 / gamma) - blackLuminance ** (1 / gamma));

    const f = (V: number) => a * Math.max(V + b, 0) ** gamma;
    const L = evenFn(f)(V);
    return L;
  },

  invEotf: (
    L,
    {
      whiteLuminance = defaults.whiteLuminance,
      blackLuminance = defaults.blackLuminance,
      gamma = defaults.gamma,
    } = defaults,
  ) => {
    const a = (whiteLuminance ** (1 / gamma) - blackLuminance ** (1 / gamma)) ** gamma;
    const b = blackLuminance ** (1 / gamma) / (whiteLuminance ** (1 / gamma) - blackLuminance ** (1 / gamma));

    const f = (L: number) => Math.max((L / a) ** (1 / gamma) - b, 0);
    const V = evenFn(f)(L);
    return V;
  },
};
