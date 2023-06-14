/**
 * Simple gamma power function
 */
import { evenFn, withProps } from "../common/util.js";
import { ToneResponseCurve, TransferFunction } from "../curves.js";

interface GammaTransferProps {
  whiteLuminance: number;
  blackLuminance: number;
  gamma: number;
}

const defaults: GammaTransferProps = {
  whiteLuminance: 1,
  blackLuminance: 0,
  gamma: 2.2,
};

export const customGamma = (gamma: number): ToneResponseCurve<GammaTransferProps> => ({
  id: "gamma" + gamma,
  name: "Gamma " + gamma,
  eotf: withProps(
    (
      V,
      {
        whiteLuminance = defaults.whiteLuminance,
        blackLuminance = defaults.blackLuminance,
        gamma = defaults.gamma,
      } = defaults
    ) => {
      const f = (x: number) => x ** gamma;

      const L = (whiteLuminance - blackLuminance) * evenFn(f)(V) + blackLuminance;
      return L;
    },
    { gamma }
  ),
  invEotf: withProps(
    (
      L,
      {
        whiteLuminance = defaults.whiteLuminance,
        blackLuminance = defaults.blackLuminance,
        gamma = defaults.gamma,
      } = defaults
    ) => {
      const f = (x: number) => x ** (1 / gamma);

      const V = evenFn(f)((L - blackLuminance) / (whiteLuminance - blackLuminance));
      return V;
    },
    { gamma }
  ),
});

export const gamma1p8 = customGamma(1.8);
export const gamma2p2 = customGamma(2.2);
export const gamma2p4 = customGamma(2.4);
export const gamma2p6 = customGamma(2.6);
