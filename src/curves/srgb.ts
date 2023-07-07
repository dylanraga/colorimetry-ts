/**
 * Extended sRGB, using higher-precision constants
 * https://entropymine.com/imageworsener/srgbformula/
 */
import { evenFn } from "../common/util.js";
import { ToneResponseCurve } from "./index.js";

const X1 = 0.0404482362771082;
const X2 = 0.00313066844250063;

type SrgbTransferProps = {
  whiteLuminance: number;
  blackLuminance: number;
};

const defaults: SrgbTransferProps = {
  whiteLuminance: 1,
  blackLuminance: 0,
};

export const srgb: ToneResponseCurve<SrgbTransferProps> = {
  id: "srgb",
  name: "Piecewise sRGB",
  eotf: (V, { whiteLuminance = defaults.whiteLuminance, blackLuminance = defaults.blackLuminance } = defaults) => {
    const f = (x: number) => (x <= X1 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);

    const L = (whiteLuminance - blackLuminance) * evenFn(f)(V) + blackLuminance;
    return L;
  },
  invEotf: (L, { whiteLuminance = defaults.whiteLuminance, blackLuminance = defaults.blackLuminance } = defaults) => {
    const f = (x: number) => (x <= X2 ? x * 12.92 : 1.055 * x ** (1 / 2.4) - 0.055);

    const V = evenFn(f)((L - blackLuminance) / (whiteLuminance - blackLuminance));
    return V;
  },
};
