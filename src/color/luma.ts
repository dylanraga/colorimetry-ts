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

function _getLuma(this: Color, rgbSpace?: EncodedRGBColorSpace) {
  let _rgbSpace = rgbSpace;
  // TODO: check space id instead once implemented
  if (!rgbSpace && "gamut" in this.space && "curve" in this.space) {
    _rgbSpace = this.space as EncodedRGBColorSpace;
  }
  if (_rgbSpace === undefined) {
    throw new Error("No RGB color space was defined");
  }
  return getLuma(this, _rgbSpace);
}

declare module "../color" {
  interface Color {
    luma: typeof _getLuma;
  }
}

Color.prototype.luma = _getLuma;
