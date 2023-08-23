import * as rgbSpaces from "./rgb/index.js";
import { xyz, xyz_n } from "./xyz.js";
import { lab, lab_d50, lch } from "./cielab.js";
import { luv } from "./cieluv.js";
import { xyy } from "./ciexyy.js";
import { ictcp, itp, itp_lch } from "./ictcp.js";
import { jzazbz, jzczhz } from "./jzazbz.js";
import { oklab, oklch } from "./oklab.js";
import { uv } from "./uv.js";
import { xy } from "./xy.js";

export const spaces = {
  ...rgbSpaces,
  xyz,
  xyz_n,
  lab,
  lab_d50,
  lch,
  luv,
  xyy,
  ictcp,
  itp,
  itp_lch,
  jzazbz,
  jzczhz,
  oklab,
  oklch,
  uv,
  xy,
};

// export {
//   rgbSpace,
//   linearRgbSpace,
//   LinearRGBColorSpace,
//   EncodedRGBColorSpace,
//   getRgbToXyzMatrix,
//   getXyzToRgbMatrix,
// } from "./rgb.js";
