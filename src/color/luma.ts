/**
 * Color luma module
 */

import { Color } from "../color.js";
import { ColorGamutPrimaries } from "../gamut.js";
import { ColorSpace } from "../space.js";

function getLuma(color: Color, gamut: ColorGamutPrimaries) {
  const [yr, yg, yb] = rgbSpace.gamut.getMatrixRGBToXYZ()[1];
  const [r, g, b] = color.toSpace(rgbSpace).values;
  const luma = r * yr + g * yg + b * yb;
  return luma;
}

function _getLuma(this: Color, rgbSpace: ColorSpace) {
  return getLuma(this, rgbSpace);
}

declare module "../color" {
  interface Color {
    readonly luma: ReturnType<typeof _getLuma>;
  }
}

Object.defineProperty(Color.prototype, "luma", { get: _getLuma });
