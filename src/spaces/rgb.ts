import { dequantize, memoize, minv, mmult3331, quantize } from "../common/util.js";
import { ToneResponseCurve } from "../curves/index.js";
import { ColorGamutPrimaries } from "../gamuts/index.js";
import { ColorSpace, contextSpace } from "../space.js";
import { xyz } from "./xyz.js";

export type LinearRGBColorSpace = ColorSpace & { gamut: ColorGamutPrimaries };
export type EncodedRGBColorSpace = ColorSpace & {
  gamut: ColorGamutPrimaries;
  curve: ToneResponseCurve;
  whiteLuminance: number;
  blackLuminance: number;
  peakLuminance: number;
  bitDepth: number;
};

export const linearRgbSpace = memoize(
  ({ name = "Linear RGB Color Space", gamut }: { name?: string; gamut: ColorGamutPrimaries }) => {
    const context = { gamut } as const;

    const newSpace = new ColorSpace({
      name,
      keys: ["R", "G", "B"],
      conversions: [
        {
          spaceB: xyz,
          aToB: (values, newContext) => xyzFromLinearRGB(values, Object.assign(context, newContext)),
          bToA: (values, newContext) => linearRgbFromXyz(values, Object.assign(context, newContext)),
        },
      ],
    });

    const newLinearRgbSpace = Object.assign(newSpace, context);

    return newLinearRgbSpace;
  }
);

export const rgbSpace = memoize(
  ({
    name = "Encoded RGB Color Space",
    gamut,
    curve,
    whiteLuminance = 100,
    blackLuminance = 0,
    peakLuminance = whiteLuminance,
    bitDepth = 0,
  }: {
    name?: string;
    gamut: ColorGamutPrimaries;
    curve: ToneResponseCurve;
    whiteLuminance: number;
    blackLuminance: number;
    peakLuminance?: number;
    bitDepth?: number;
  }) => {
    const context = { gamut, curve, whiteLuminance, blackLuminance, peakLuminance, bitDepth } as const;

    const newSpace = new ColorSpace({
      name,
      keys: ["r", "g", "b"],
      conversions: [
        {
          spaceB: linearRgbSpace({ gamut }),
          aToB: (values, newContext) => linearRgbFromEncodedRgb(values, Object.assign(context, newContext)),
          bToA: (values, newContext) => encodedRgbFromLinearRgb(values, Object.assign(context, newContext)),
        },
      ],
    });

    const newRgbSpace = Object.assign(newSpace, context);

    return newRgbSpace;
  }
);

const rgbToXyzMatrixCache = new WeakMap<ColorGamutPrimaries, number[][]>();
export function getRgbToXyzMatrix(gamut: ColorGamutPrimaries) {
  const existingMatrix = rgbToXyzMatrixCache.get(gamut);
  if (existingMatrix) return existingMatrix;

  const primaries = [gamut.white, gamut.red, gamut.green, gamut.blue];

  const [Xw, Xr, Xg, Xb] = primaries.map((u) => u.x / u.y);
  const [Zw, Zr, Zg, Zb] = primaries.map((u) => (1 - u.x - u.y) / u.y);

  const [Sr, Sg, Sb] = mmult3331(
    minv([
      [Xr, Xg, Xb],
      [1, 1, 1],
      [Zr, Zg, Zb],
    ]),
    [Xw, 1, Zw]
  );
  const rgbToXyzMatrix = [
    [Sr * Xr, Sg * Xg, Sb * Xb],
    [Sr, Sg, Sb],
    [Sr * Zr, Sg * Zg, Sb * Zb],
  ];
  rgbToXyzMatrixCache.set(gamut, rgbToXyzMatrix);

  return rgbToXyzMatrix;
}

const xyzToRgbMatrixCache = new WeakMap<ColorGamutPrimaries, number[][]>();
export function getXyzToRgbMatrix(gamut: ColorGamutPrimaries) {
  const existingMatrix = xyzToRgbMatrixCache.get(gamut);
  if (existingMatrix) return existingMatrix;

  const newMatrix = minv(getRgbToXyzMatrix(gamut));
  xyzToRgbMatrixCache.set(gamut, newMatrix);

  return newMatrix;
}

function linearRgbFromXyz(xyz: number[], { gamut }: { gamut: ColorGamutPrimaries }) {
  return mmult3331(getXyzToRgbMatrix(gamut), xyz);
}

function xyzFromLinearRGB(linearRgb: number[], { gamut }: { gamut: ColorGamutPrimaries }) {
  return mmult3331(getRgbToXyzMatrix(gamut), linearRgb);
}

function encodedRgbFromLinearRgb(
  linearRgb: [number, number, number],
  {
    curve,
    whiteLuminance,
    blackLuminance,
    peakLuminance,
  }: // bitDepth = 0,
  {
    curve: ToneResponseCurve;
    whiteLuminance: number;
    blackLuminance: number;
    peakLuminance?: number;
    bitDepth?: number;
  }
): [number, number, number] {
  const V = linearRgb.map((v) => curve.invEotf(v, { whiteLuminance, blackLuminance, peakLuminance }));
  // return (bitDepth > 0 ? V.map((v) => quantize(v, bitDepth)) : V) as [number, number, number];
  return V as [number, number, number];
}

function linearRgbFromEncodedRgb(
  encodedRgb: [number, number, number],
  {
    curve,
    whiteLuminance,
    blackLuminance,
    peakLuminance,
  }: // bitDepth = 0,
  {
    curve: ToneResponseCurve;
    whiteLuminance: number;
    blackLuminance: number;
    peakLuminance?: number;
    bitDepth?: number;
  }
): [number, number, number] {
  // const V = bitDepth > 0 ? encodedRgb.map((v) => dequantize(v, bitDepth)) : encodedRgb;
  const V = encodedRgb;
  const L = V.map((v) => curve.eotf(v, { whiteLuminance, blackLuminance, peakLuminance }));
  return L as [number, number, number];
}
