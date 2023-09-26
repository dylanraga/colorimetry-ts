// YUV Y'CbCr
// TODO: needs testing

import { dequantize, memoize, minv, mmult3331, quantize } from "../common/util.js";
import { curves } from "../curves/index.js";
import { ColorGamutPrimaries, gamuts } from "../gamuts/index.js";
import { ColorSpace, fnSpace } from "../space.js";
import { EncodedRGBColorSpace, getRgbToXyzMatrix, rgbSpace } from "./rgb.js";
import { rec709 } from "./rgb/index.js";

export const ypbprSpace = memoize(
  ({ id, rgbSpace }: { id?: string; rgbSpace: EncodedRGBColorSpace }) => {
    const { name, gamut, curve, whiteLuminance, blackLuminance, peakLuminance } = rgbSpace;
    return Object.assign(
      new ColorSpace({
        id,
        name: `Y'PbPr (${name})`,
        keys: ["Y'", "Pb", "Pr"],
        conversions: [
          {
            spaceB: rgbSpace,
            aToB: (values) => rgbFromYpbpr(values, rgbSpace.gamut),
            bToA: (values) => ypbprFromRgb(values, rgbSpace.gamut),
          },
        ],
      }),
      { gamut, curve, whiteLuminance, blackLuminance, peakLuminance },
    );
  },
  ({ rgbSpace }) => rgbSpace.id ?? undefined,
);

export const ycbcrSpace = memoize(
  ({ id, rgbSpace, bitDepth }: { id?: string; rgbSpace: EncodedRGBColorSpace; bitDepth?: number }) => {
    if (!bitDepth) {
      return ypbprSpace({ rgbSpace });
    }

    const { name, gamut, curve, whiteLuminance, blackLuminance, peakLuminance } = rgbSpace;
    return Object.assign(
      new ColorSpace({
        id,
        name: `Y'CbCr (${name})`,
        keys: ["Y'", "Cb", "Cr"],
        conversions: [
          {
            spaceB: ypbprSpace({ rgbSpace }),
            aToB: (values) => ypbprFromYcbcr(values, bitDepth),
            bToA: (values) => ycbcrFromYpbpr(values, bitDepth),
          },
        ],
      }),
      { gamut, curve, whiteLuminance, blackLuminance, peakLuminance, bitDepth },
    );
  },
  ({ rgbSpace, bitDepth }) => (rgbSpace.id ? `${rgbSpace.id}-${bitDepth}bpc` : undefined),
);

export const ycbcr601 = fnSpace(ycbcrSpace, {
  rgbSpace: rgbSpace({ gamut: gamuts.bt601, curve: curves.bt1886, whiteLuminance: 100, blackLuminance: 0 }),
  bitDepth: 8,
});

export const ycbcr = fnSpace(ycbcrSpace, { rgbSpace: rec709(), bitDepth: 8 });
export const ycbcr10 = fnSpace(ycbcrSpace, { rgbSpace: rec709(), bitDepth: 10 });
export const ypbpr = fnSpace(ycbcrSpace, { rgbSpace: rec709() });

export const getRgbToYpbprMatrix = memoize(
  (gamut: ColorGamutPrimaries): [[number, number, number], [number, number, number], [number, number, number]] => {
    const [kr, kg, kb] = getRgbToXyzMatrix(gamut)[1];
    return [
      [kr, kg, kb],
      [(-0.5 * kr) / (1 - kb), (-0.5 * kg) / (1 - kb), 0.5],
      [0.5, (-0.5 * kg) / (1 - kr), (-0.5 * kb) / (1 - kr)],
    ];
  },
);

export const getYpbprToRgbMatrix = memoize(
  (gamut: ColorGamutPrimaries): [[number, number, number], [number, number, number], [number, number, number]] => {
    return minv(getRgbToYpbprMatrix(gamut)) as [
      [number, number, number],
      [number, number, number],
      [number, number, number],
    ];
  },
);

export function ypbprFromRgb(rgb: [number, number, number], gamut: ColorGamutPrimaries) {
  return mmult3331(getRgbToYpbprMatrix(gamut), rgb);
}

export function rgbFromYpbpr(ypbpr: [number, number, number], gamut: ColorGamutPrimaries) {
  return mmult3331(getYpbprToRgbMatrix(gamut), ypbpr);
}

export function ycbcrFromYpbpr([Y, Pb, Pr]: [number, number, number], bitDepth = 8): [number, number, number] {
  return [
    quantize(Y, bitDepth, "limited"),
    quantize(Pb + 0.5, bitDepth, "chrominance"),
    quantize(Pr + 0.5, bitDepth, "chrominance"),
  ];
}
export function ypbprFromYcbcr([Y, Cb, Cr]: [number, number, number], bitDepth = 8): [number, number, number] {
  return [
    dequantize(Y, bitDepth, "limited"),
    dequantize(Cb, bitDepth, "chrominance") - 0.5,
    dequantize(Cr, bitDepth, "chrominance") - 0.5,
  ];
}
