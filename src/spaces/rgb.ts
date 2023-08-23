import { minv, mmult3331, quantizeToBits } from "../common/util.js";
import { ToneResponseCurve } from "../curves/index.js";
import { ColorGamutPrimaries } from "../gamuts/index.js";
import { ColorSpace } from "../space.js";
import { xyz } from "./xyz.js";

export type LinearRGBColorSpace = ColorSpace & { gamut: ColorGamutPrimaries };
export type EncodedRGBColorSpace = ColorSpace & { gamut: ColorGamutPrimaries; curve: ToneResponseCurve };

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

  const newSpace = new ColorSpace<{ gamut: ColorGamutPrimaries }>({
    name,
    keys: ["R", "G", "B"],
    conversions: [
      {
        spaceB: xyz,
        aToB: (values, props) => linearRgbToXyz(values, { gamut, ...props }),
        bToA: (values, props) => xyzToLinearRgb(values, { gamut, ...props }),
      },
    ],
  });

  const newLinearRgbSpace = Object.assign(newSpace, { gamut });

  linearRgbSpaceGamutCache.set(gamut, newLinearRgbSpace);

  return newLinearRgbSpace;
}

export function rgbSpace({
  name = "RGB Color Space",
  gamut,
  curve,
  whiteLuminance,
  blackLuminance,
  peakLuminance,
}: {
  name?: string;
  gamut: ColorGamutPrimaries;
  curve: ToneResponseCurve;
  whiteLuminance: number;
  blackLuminance: number;
  peakLuminance?: number;
}): EncodedRGBColorSpace {
  const newSpace = new ColorSpace<{
    gamut: ColorGamutPrimaries;
    curve: ToneResponseCurve;
    whiteLuminance: number;
    blackLuminance: number;
    peakLuminance: number;
    bitDepth: number;
  }>({
    name,
    keys: ["r", "g", "b"],
    conversions: [
      {
        spaceB: linearRgbSpace({ gamut }),
        aToB: (values, props) =>
          encodedRgbToLinearRgb(values, { gamut, curve, whiteLuminance, blackLuminance, peakLuminance, ...props }),
        bToA: (values, props) =>
          linearRgbToEncodedRgb(values, { gamut, curve, whiteLuminance, blackLuminance, peakLuminance, ...props }),
      },
    ],
  });

  const newRgbSpace = Object.assign(newSpace, { gamut, curve });

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
    bitDepth: number;
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
    bitDepth: number;
  }
) {
  const V = bitDepth > 0 ? encodedRgb.map((v) => v / ((2 << (bitDepth - 1)) - 1)) : encodedRgb;
  const L = V.map((v) => curve.eotf(v, { whiteLuminance, blackLuminance, peakLuminance }));
  return L;
}
