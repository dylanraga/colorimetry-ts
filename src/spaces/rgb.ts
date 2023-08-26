import { minv, mmult3331, quantizeToBits } from "../common/util.js";
import { ToneResponseCurve } from "../curves/index.js";
import { ColorGamutPrimaries } from "../gamuts/index.js";
import { ColorSpace } from "../space.js";
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

const linearRgbSpaceGamutCache = new WeakMap<ColorGamutPrimaries, LinearRGBColorSpace>();

export function linearRgbSpace({
  name = "Linear RGB Color Space",
  gamut,
}: {
  name?: string;
  gamut: ColorGamutPrimaries;
}): LinearRGBColorSpace {
  const existingSpace = linearRgbSpaceGamutCache.get(gamut);
  if (existingSpace) return existingSpace;

  const context = { gamut } as const;

  const newSpace = new ColorSpace({
    name,
    keys: ["R", "G", "B"],
    conversions: [
      {
        spaceB: xyz,
        aToB: (values, newContext) => linearRgbToXyz(values, Object.assign(context, newContext)),
        bToA: (values, newContext) => xyzToLinearRgb(values, Object.assign(context, newContext)),
      },
    ],
  });

  const newLinearRgbSpace = Object.assign(newSpace, context);

  linearRgbSpaceGamutCache.set(gamut, newLinearRgbSpace);

  return newLinearRgbSpace;
}

export function rgbSpace({
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
}): EncodedRGBColorSpace {
  const context = { gamut, curve, whiteLuminance, blackLuminance, peakLuminance, bitDepth } as const;

  const newSpace = new ColorSpace({
    name,
    keys: ["r", "g", "b"],
    conversions: [
      {
        spaceB: linearRgbSpace({ gamut }),
        aToB: (values, newContext) => encodedRgbToLinearRgb(values, Object.assign(context, newContext)),
        bToA: (values, newContext) => linearRgbToEncodedRgb(values, Object.assign(context, newContext)),
      },
    ],
  });

  const newRgbSpace = Object.assign(newSpace, context);

  return newRgbSpace;
}

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

function xyzToLinearRgb(xyz: number[], { gamut }: { gamut: ColorGamutPrimaries }) {
  return mmult3331(getXyzToRgbMatrix(gamut), xyz);
}

function linearRgbToXyz(linearRgb: number[], { gamut }: { gamut: ColorGamutPrimaries }) {
  return mmult3331(getRgbToXyzMatrix(gamut), linearRgb);
}

function linearRgbToEncodedRgb(
  linearRgb: number[],
  {
    curve,
    whiteLuminance,
    blackLuminance,
    peakLuminance,
    bitDepth = 0,
  }: {
    curve: ToneResponseCurve;
    whiteLuminance: number;
    blackLuminance: number;
    peakLuminance?: number;
    bitDepth?: number;
  }
) {
  const V = linearRgb.map((v) => curve.invEotf(v, { whiteLuminance, blackLuminance, peakLuminance }));
  return bitDepth > 0 ? V.map((v) => quantizeToBits(v, bitDepth)) : V;
}

function encodedRgbToLinearRgb(
  encodedRgb: number[],
  {
    curve,
    whiteLuminance,
    blackLuminance,
    peakLuminance,
    bitDepth = 0,
  }: {
    curve: ToneResponseCurve;
    whiteLuminance: number;
    blackLuminance: number;
    peakLuminance?: number;
    bitDepth?: number;
  }
) {
  const V = bitDepth > 0 ? encodedRgb.map((v) => v / ((2 << (bitDepth - 1)) - 1)) : encodedRgb;
  const L = V.map((v) => curve.eotf(v, { whiteLuminance, blackLuminance, peakLuminance }));
  return L;
}
