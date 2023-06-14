import * as _curves from "./curves/index.js";

export interface DefaultToneResponseCurveProps {
  whiteLuminance: number;
  blackLuminance: number;
  peakLuminance?: number;
}

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

export type ToneResponseCurveName = keyof typeof _curves;
export const curves = _curves as typeof _curves & Record<string, ToneResponseCurve>;

// export const createCurve = <P extends Record<string, any> | undefined = undefined>(fn: TransferFunction<P>) => {
//   return ((arg0: number | Partial<P>, props?: Partial<P>) => {
//     if (typeof arg0 === "number") {
//       return fn(arg0, props);
//     } else {
//       return createCurve<P>((newArg0, newProps) => fn(newArg0, { ...arg0, ...newProps }));
//       // return ((value, newProps) => fn(value, { ...arg0, ...newProps })) as TransferFunction<P>;
//     }
//   }) as TransferFunction<P> & typeof createCurve;
// };
