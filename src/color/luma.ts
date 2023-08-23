/**
 * Color luma module
 */

import { Color } from "../color.js";
import { EncodedRGBColorSpace, getRgbToXyzMatrix } from "../spaces/rgb.js";

function getLuma(color: Color, rgbSpace: EncodedRGBColorSpace) {
  const [yr, yg, yb] = getRgbToXyzMatrix(rgbSpace.gamut)[1];
  const [r, g, b] = color.toSpace(rgbSpace).values;
  const luma = r * yr + g * yg + b * yb;
  return luma;
}

function _getLuma(this: Color, rgbSpace: EncodedRGBColorSpace) {
  return getLuma(this, rgbSpace);
}

declare module "../color" {
  interface Color {
    luma: typeof _getLuma;
  }
}

Color.prototype.luma = _getLuma;
