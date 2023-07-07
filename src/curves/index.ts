type DefaultToneResponseCurveProps = {
  whiteLuminance: number;
  blackLuminance: number;
  peakLuminance?: number;
};

export interface ToneResponseCurve<P extends object = DefaultToneResponseCurveProps> {
  readonly name: string;
  readonly id: string;
  readonly eotf: TransferFunction<P>;
  readonly invEotf: TransferFunction<P>;
}

export type TransferFunction<P extends object = DefaultToneResponseCurveProps> = (
  value: number,
  props?: Partial<P>
) => number;

export { gammaCurve } from "./gamma.js";
export { hlgCurve } from "./hlg.js";

import { acescc } from "./acescc.js";
import { bt1886 } from "./bt1886.js";
import { gamma1p8, gamma2p2, gamma2p4, gamma2p6 } from "./gamma.js";
import { hlg } from "./hlg.js";
import { lstar } from "./lstar.js";
import { romm } from "./romm.js";
import { srgb } from "./srgb.js";
import { st2084 } from "./st2084.js";

export const curves = {
  acescc,
  bt1886,
  gamma1p8,
  gamma2p2,
  gamma2p4,
  gamma2p6,
  hlg,
  lstar,
  romm,
  srgb,
  st2084,
};
