import { Color } from "../color.js";
import { colorDiff } from "../diff.js";
import { ColorGamutPrimaries, gamuts } from "../gamuts/index.js";
import { itp_lch } from "../spaces/ictcp.js";
import { jzazbz, jzczhz } from "../spaces/jzazbz.js";
import { oklch } from "../spaces/oklab.js";
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
  gamut: ColorGamutPrimaries = gamuts.srgb,
  whiteLuminance = 1,
  blackLuminance = 0,
  tolerance = 1,
) {
  const rgbSpace = linearRgbSpace({ gamut });
  const rgb = color.toSpace(rgbSpace).values;

  if (Math.min(...rgb) > 0) {
    return color;
  }

  const rgbLch = new Color(rgbSpace, rgb).toSpace(lchSpace).values;

  // let currRgb = new Color(lchSpace, rgbLch).toSpace(rgbSpace).values;
  // while (Math.min(...currRgb) < blackLuminance) {
  //   rgbLch[1] -= jnd;
  //   currRgb = new Color(lchSpace, rgbLch).toSpace(rgbSpace).values;
  //   // console.log("here");
  // }

  // if (Math.max(...currRgb) > whiteLuminance) {
  //   currRgb = currRgb.map((v) => (whiteLuminance * v) / Math.max(...currRgb));
  // }
  // const clampedColor = new Color(rgbSpace, currRgb).toSpace(color.space);

  let rgbClamped = rgb.map((u) => Math.max(u, 0)) as [number, number, number];

  let minDiffFromClipped = colorDiff(color, new Color(rgbSpace, rgbClamped));
  //console.log('currRgb', rgb, rgbClamped, dEFromClipped);
  while (minDiffFromClipped > tolerance) {
    // Give up on significantly higher or lower lightness clampings
    if (rgbLch[1] < jnd) {
      return new Color(rgbSpace, rgbClamped).toSpace(color.space);
    }
    rgbLch[1] -= jnd * (Math.SQRT1_2 * minDiffFromClipped);
    const currLchColor = new Color(lchSpace(), rgbLch);
    const currRgb = currLchColor.toSpace(rgbSpace).values;
    // if in-gamut, push out of gamut
    // while (Math.min(...currRgb) > blackLuminance && Math.max(...currRgb) < whiteLuminance) {
    //   rgbLch[1] += jnd * (0.1 * dEFromClipped);
    //   currLchColor = new Color(lchSpace, rgbLch);
    //   currRgb = currLchColor.toSpace(rgbSpace).values;
    // }
    const newRgbClamped = currRgb.map((u) => Math.max(u, 0)) as [number, number, number];
    const diffFromClipped = colorDiff(currLchColor, new Color(rgbSpace, rgbClamped));
    if (diffFromClipped > minDiffFromClipped) {
      return new Color(rgbSpace, rgbClamped).toSpace(color.space);
    }
    minDiffFromClipped = diffFromClipped;
    rgbClamped = newRgbClamped;
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
  }: { gamut: ColorGamutPrimaries; whiteLuminance?: number; blackLuminance?: number; tolerance?: number },
) {
  return clampInGamut(this, gamut, whiteLuminance, blackLuminance, tolerance);
}

declare module "../color" {
  interface Color {
    clampInGamut: typeof _clampInGamut;
  }
}

Color.prototype.clampInGamut = _clampInGamut;
