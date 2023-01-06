export interface ToneResponseCurve<P = Record<string, never>> {
  name: string;
  id: string;
  eotf: (value: number, props?: Partial<P>) => number;
  invEotf: (luminance: number, props?: Partial<P>) => number;
}
