import { dequantize, memoize, minv, mmult3331, quantize } from "../common/util.js";
import { ToneResponseCurve } from "../curves/index.js";
import { ColorGamutPrimaries } from "../gamuts/index.js";
import { ColorSpace } from "../space.js";
import { xyz } from "./xyz.js";

type LinearRGBColorSpaceContext = {
  gamut: ColorGamutPrimaries;
};
export type LinearRGBColorSpace = ColorSpace & LinearRGBColorSpaceContext;

type EncodedRGBColorSpaceContext = {
  gamut: ColorGamutPrimaries;
  curve: ToneResponseCurve;
  whiteLuminance: number;
  blackLuminance: number;
  peakLuminance?: number;
};
export type EncodedRGBColorSpace = ColorSpace & EncodedRGBColorSpaceContext;

type QuantizedRGBColorSpaceContext = {
  gamut: ColorGamutPrimaries;
  curve: ToneResponseCurve;
  whiteLuminance: number;
  blackLuminance: number;
  peakLuminance?: number;
  bitDepth: number;
  range: "full" | "limited";
};
export type QuantizedRGBColorSpace = ColorSpace & QuantizedRGBColorSpaceContext;

const linearRgbSpace = memoize((context: LinearRGBColorSpaceContext) => {
  const newSpace = new ColorSpace({
    keys: ["R", "G", "B"],
    conversions: [
      {
        spaceB: xyz(),
        aToB: (values) => xyzFromLinearRGB(values, context.gamut),
        bToA: (values) => linearRgbFromXyz(values, context.gamut),
      },
    ],
  });

  return Object.assign(newSpace, context);
});

const encodedRgbSpace = memoize((context: EncodedRGBColorSpaceContext) =>
  Object.assign(
    new ColorSpace({
      keys: ["r", "g", "b"],
      conversions: [
        {
          spaceB: linearRgbSpace({ gamut: context.gamut }),
          aToB: (values) => linearRgbFromEncodedRgb(values, context),
          bToA: (values) => encodedRgbFromLinearRgb(values, context),
        },
      ],
    }),
    context,
  ),
);

const quantizedRgbSpace = memoize((context: QuantizedRGBColorSpaceContext) =>
  Object.assign(
    new ColorSpace({
      keys: ["r", "g", "b"],
      conversions: [
        {
          spaceB: encodedRgbSpace({
            gamut: context.gamut,
            curve: context.curve,
            whiteLuminance: context.whiteLuminance,
            blackLuminance: context.blackLuminance,
            peakLuminance: context.peakLuminance,
          }),
          aToB: (values) => encodedRgbFromQuantizedRgb(values, context),
          bToA: (values) => quantizedRgbFromEncodedRgb(values, context),
        },
      ],
    }),
    context,
  ),
);

// typescript'd
// someone please figure out cleaner type narrowing for this
export const rgbSpace = memoize(
  <T extends LinearRGBColorSpaceContext | EncodedRGBColorSpaceContext | QuantizedRGBColorSpaceContext>(
    context: T,
  ): ColorSpace & T => {
    const { gamut } = context;
    if (!("curve" in context)) {
      return linearRgbSpace({ gamut }) as unknown as ColorSpace & T;
    }

    const { curve, whiteLuminance, blackLuminance, peakLuminance } = context;
    if (!("bitDepth" in context)) {
      return encodedRgbSpace({ gamut, curve, whiteLuminance, blackLuminance, peakLuminance }) as unknown as ColorSpace &
        T;
    }

    const { bitDepth, range = "full" } = context;
    return quantizedRgbSpace({
      gamut,
      curve,
      whiteLuminance,
      blackLuminance,
      peakLuminance,
      bitDepth,
      range,
    }) as unknown as ColorSpace & T;
  },
);

// export const createRgbSpace = (origContext: RGBColorSpaceContext) => (context: RGBColorSpaceContext) =>
//   rgbSpace({ ...origContext, ...context });

export const getRgbToXyzMatrix = memoize((gamut: ColorGamutPrimaries) => {
  const primaries = [gamut.white, gamut.red, gamut.green, gamut.blue];

  const [Xw, Xr, Xg, Xb] = primaries.map((u) => u.x / u.y);
  const [Zw, Zr, Zg, Zb] = primaries.map((u) => (1 - u.x - u.y) / u.y);

  const [Sr, Sg, Sb] = mmult3331(
    minv([
      [Xr, Xg, Xb],
      [1, 1, 1],
      [Zr, Zg, Zb],
    ]),
    [Xw, 1, Zw],
  );
  const rgbToXyzMatrix = [
    [Sr * Xr, Sg * Xg, Sb * Xb],
    [Sr, Sg, Sb],
    [Sr * Zr, Sg * Zg, Sb * Zb],
  ];

  return rgbToXyzMatrix;
});

export const getXyzToRgbMatrix = memoize((gamut: ColorGamutPrimaries) => minv(getRgbToXyzMatrix(gamut)));

function linearRgbFromXyz(xyz: number[], gamut: ColorGamutPrimaries) {
  return mmult3331(getXyzToRgbMatrix(gamut), xyz);
}

function xyzFromLinearRGB(linearRgb: number[], gamut: ColorGamutPrimaries) {
  return mmult3331(getRgbToXyzMatrix(gamut), linearRgb);
}

function encodedRgbFromLinearRgb(
  linearRgb: [number, number, number],
  {
    curve,
    whiteLuminance,
    blackLuminance,
    peakLuminance,
  }: {
    curve: ToneResponseCurve;
    whiteLuminance: number;
    blackLuminance: number;
    peakLuminance?: number;
  },
): [number, number, number] {
  return linearRgb.map((v) => curve.invEotf(v, { whiteLuminance, blackLuminance, peakLuminance })) as [
    number,
    number,
    number,
  ];
}

function linearRgbFromEncodedRgb(
  encodedRgb: [number, number, number],
  {
    curve,
    whiteLuminance,
    blackLuminance,
    peakLuminance,
  }: {
    curve: ToneResponseCurve;
    whiteLuminance: number;
    blackLuminance: number;
    peakLuminance?: number;
  },
): [number, number, number] {
  return encodedRgb.map((v) => curve.eotf(v, { whiteLuminance, blackLuminance, peakLuminance })) as [
    number,
    number,
    number,
  ];
}

function quantizedRgbFromEncodedRgb(
  encodedRgb: [number, number, number],
  { bitDepth, range }: { bitDepth: number; range: "limited" | "full" },
): [number, number, number] {
  return encodedRgb.map((v) => quantize(v, bitDepth, range)) as [number, number, number];
}
function encodedRgbFromQuantizedRgb(
  quantizedRgb: [number, number, number],
  { bitDepth, range }: { bitDepth: number; range: "limited" | "full" },
): [number, number, number] {
  return quantizedRgb.map((v) => dequantize(v, bitDepth, range)) as [number, number, number];
}
