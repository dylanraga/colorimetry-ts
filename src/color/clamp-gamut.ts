import { Color } from "../color.js";
import { colorDiff } from "../diff.js";
import { ColorGamutPrimaries } from "../gamuts/index.js";
import { itp_lch } from "../spaces/ictcp.js";
import { linearRgbSpace } from "../spaces/rgb.js";

export function clamp(v: number, min: number, max: number) {
  if (v < min) return min;
  if (v > max) return max;

  return v;
}

const lchSpace = itp_lch;
// ΔE_ITP JND = 1/720 = 0.00139
const jnd = 1 / 720;

// Clamps out-of-gamut rgb values in-gamut with minimum chroma loss
// Process:
// - Compare rgb value to clipped rgb value:
// -- If ΔE_ITP < 3, return clipped rgb
// -- Otherwise, reduce chroma by sqrt(1/2) * ΔE_ITP and re-compare
export function clampInGamut(
  color: Color,
  gamut: ColorGamutPrimaries,
  whiteLuminance = 1,
  blackLuminance = 0,
  tolerance = 1
) {
  const rgbSpace = linearRgbSpace({ gamut });
  const rgb = color.toSpace(rgbSpace).values;

  if (Math.min(...rgb) >= blackLuminance && Math.max(...rgb) <= whiteLuminance) {
    return color;
  }

  let rgbClamped = rgb.map((u) => clamp(u, blackLuminance, whiteLuminance));

  const rgbLch = new Color(rgbSpace, rgb).toSpace(lchSpace).values;

  let dEFromClipped = colorDiff(new Color(lchSpace, rgbLch), new Color(rgbSpace, rgbClamped));
  //console.log('currRgb', rgb, rgbClamped, dEFromClipped);
  while (dEFromClipped > tolerance) {
    // Give up on significantly higher or lower lightness clampings
    if (rgbLch[1] < jnd) {
      return new Color(rgbSpace, rgbClamped).toSpace(color.space);
    }
    rgbLch[1] -= jnd * (Math.SQRT1_2 * dEFromClipped);
    const currLchColor = new Color(lchSpace, rgbLch);
    const currRgb = currLchColor.toSpace(rgbSpace).values;
    // if in-gamut, push out of gamut
    // while (Math.min(...currRgb) > blackLuminance && Math.max(...currRgb) < whiteLuminance) {
    //   rgbLch[1] += jnd * (0.1 * dEFromClipped);
    //   currLchColor = new Color(lchSpace, rgbLch);
    //   currRgb = currLchColor.toSpace(rgbSpace).values;
    // }
    rgbClamped = currRgb.map((u) => clamp(u, blackLuminance, whiteLuminance));
    dEFromClipped = colorDiff(currLchColor, new Color(rgbSpace, rgbClamped));
    // console.log("currRgb", currRgb, rgbClamped, dEFromClipped);
  }

  const clampedColor = new Color(rgbSpace, rgbClamped).toSpace(color.space);

  return clampedColor;
}

function _clampInGamut(
  this: Color,
  {
    gamut,
    whiteLuminance = 1,
    blackLuminance = 0,
    tolerance = 1,
  }: { gamut: ColorGamutPrimaries; whiteLuminance?: number; blackLuminance?: number; tolerance?: number }
) {
  return clampInGamut(this, gamut, whiteLuminance, blackLuminance, tolerance);
}

declare module "../color" {
  interface Color {
    clampInGamut: typeof _clampInGamut;
  }
}

Color.prototype.clampInGamut = _clampInGamut;
