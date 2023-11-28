import * as rgbSpaces from "./rgb/index.js";
import { xyz, xyz_n } from "./xyz.js";
import { lab, lab_d50, lch } from "./cielab.js";
import { luv } from "./cieluv.js";
import { yxy } from "./cieyxy.js";
import { ictcp, itp, itp_lch } from "./ictcp.js";
import { jzazbz, jzczhz } from "./jzazbz.js";
import { oklab, oklch } from "./oklab.js";
import { uv76 } from "./uv.js";
import { xy } from "./xy.js";
// import { ycbcr, ycbcr10, ypbpr, ycbcr601 } from "./yuv.js";

export const spaces = {
  ...rgbSpaces,
  xyz,
  xyz_n,
  lab,
  lab_d50,
  lch,
  luv,
  yxy,
  ictcp,
  itp,
  itp_lch,
  jzazbz,
  jzczhz,
  oklab,
  oklch,
  uv76,
  xy,
  // ycbcr,
  // ycbcr10,
  // ypbpr,
  // ycbcr601,
};

// export {
//   rgbSpace,
//   linearRgbSpace,
//   LinearRGBColorSpace,
//   EncodedRGBColorSpace,
//   getRgbToXyzMatrix,
//   getXyzToRgbMatrix,
// } from "./rgb.js";
