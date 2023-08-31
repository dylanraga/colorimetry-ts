import { minv, mmult3331 } from "../common/util.js";
import { curves } from "../curves/index.js";
import { ColorGamutPrimaries, gamuts } from "../gamuts/index.js";
import { ColorSpace } from "../space.js";
import { spaces } from "./index.js";
import { EncodedRGBColorSpace, getRgbToXyzMatrix, rgbSpace } from "./rgb.js";

export const ypbpr = ycbcrSpaceFromRgbSpace(
  rgbSpace({ gamut: gamuts.bt601, curve: curves.bt1886, whiteLuminance: 100, blackLuminance: 0 })
);

export const ypbpr709 = ycbcrSpaceFromRgbSpace(spaces.rec709);

export function ycbcrSpaceFromRgbSpace(rgbSpace: EncodedRGBColorSpace) {
  const { name, keys, ...rgbProps } = rgbSpace;
  return Object.assign(
    new ColorSpace({
      name: "Y'CbCr Color Space",
      keys: ["Y'", "Cb", "Cr"],
      conversions: [
        {
          spaceB: rgbSpace,
          aToB: (values) => rgbFromYpbpr(values, rgbSpace.gamut),
          bToA: (values) => ypbprFromRgb(values, rgbSpace.gamut),
        },
      ],
    }),
    { ...rgbProps }
  );
}

export function getRgbToYpbprMatrix(
  gamut: ColorGamutPrimaries
): [[number, number, number], [number, number, number], [number, number, number]] {
  const [kr, kg, kb] = getRgbToXyzMatrix(gamut)[1];
  return [
    [kr, kg, kb],
    [(-0.5 * kr) / (1 - kb), (-0.5 * kg) / (1 - kb), 0.5],
    [0.5, (-0.5 * kg) / (1 - kr), (-0.5 * kb) / (1 - kr)],
  ];
}

export function getYpbprToRgbMatrix(
  gamut: ColorGamutPrimaries
): [[number, number, number], [number, number, number], [number, number, number]] {
  return minv(getRgbToYpbprMatrix(gamut)) as [
    [number, number, number],
    [number, number, number],
    [number, number, number]
  ];
}

export function ypbprFromRgb(rgb: [number, number, number], gamut: ColorGamutPrimaries) {
  return mmult3331(getRgbToYpbprMatrix(gamut), rgb);
}

export function rgbFromYpbpr(ypbpr: [number, number, number], gamut: ColorGamutPrimaries) {
  return mmult3331(getYpbprToRgbMatrix(gamut), ypbpr);
}
