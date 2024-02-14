/*====================*/
/* Author: Dylan Raga */
/*====================*/

import { illuminants } from "./illuminants/index.js";
export { illuminants };

import { gamuts, ColorGamutPrimaries } from "./gamuts/index.js";
export { gamuts, ColorGamutPrimaries };

import { curves, ToneResponseCurve, gammaCurve, hlgCurve } from "./curves/index.js";
export { curves, ToneResponseCurve, gammaCurve, hlgCurve };

import { spaces } from "./spaces/index.js";
export { spaces };

import {
  rgbSpace,
  LinearRGBColorSpace,
  EncodedRGBColorSpace,
  getRgbToXyzMatrix,
  getXyzToRgbMatrix,
} from "./spaces/rgb.js";
export { rgbSpace, LinearRGBColorSpace, EncodedRGBColorSpace, getRgbToXyzMatrix, getXyzToRgbMatrix };

import { ColorSpace } from "./space.js";
export { ColorSpace };

// import { xyzCat } from "./src/cat.js";
// export { xyzCat };

import { Color, color } from "./color.js";
import { diffs } from "./diffs/index.js";
export { diffs };
import { colorDiff } from "./diff.js";
import "./color/luminance.js";
import "./color/equals.js";
import "./color/keyedValues.js";
import "./color/luma.js";
import "./color/cct.js";
import "./color/clamp-gamut.js";
import "./color/cat.js";
import "./color/toJSON.js";
export { Color, color, colorDiff };

//import * as cctData from './src/common/locus_10nm.json';
import { cctData } from "./misc/locus_10nm.js";
export { cctData };

import { daylightLocusData } from "./misc/daylightlocus_10nm.js";
export { daylightLocusData };

import { cmfs1931Data } from "./misc/cmfs-cie1931xyz-2deg.js";
export { cmfs1931Data };

// export { srgb } from "./src/spaces/rgb/index.js";

import "./defaults.js";

export { mmult3331, mmult3333, minv, mmult, quantize, roundHTE, hexFromArray, arrayEquals } from "./common/util.js";
