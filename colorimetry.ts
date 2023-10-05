/*====================*/
/* Author: Dylan Raga */
/*====================*/

import { illuminants } from "./src/illuminants/index.js";
export { illuminants };

import { gamuts, ColorGamutPrimaries } from "./src/gamuts/index.js";
export { gamuts, ColorGamutPrimaries };

import { curves, ToneResponseCurve, gammaCurve, hlgCurve } from "./src/curves/index.js";
export { curves, ToneResponseCurve, gammaCurve, hlgCurve };

import { spaces } from "./src/spaces/index.js";
export { spaces };

import {
  rgbSpace,
  LinearRGBColorSpace,
  EncodedRGBColorSpace,
  getRgbToXyzMatrix,
  getXyzToRgbMatrix,
} from "./src/spaces/rgb.js";
export { rgbSpace, LinearRGBColorSpace, EncodedRGBColorSpace, getRgbToXyzMatrix, getXyzToRgbMatrix };

import { ColorSpace } from "./src/space.js";
export { ColorSpace };

// import { xyzCat } from "./src/cat.js";
// export { xyzCat };

import { Color, color } from "./src/color.js";
import { diffs } from "./src/diffs/index.js";
export { diffs };
import { colorDiff } from "./src/diff.js";
import "./src/color/luminance.js";
import "./src/color/equals.js";
import "./src/color/keyedValues.js";
import "./src/color/luma.js";
import "./src/color/cct.js";
import "./src/color/clamp-gamut.js";
import "./src/color/cat.js";
import "./src/color/toJSON.js";
export { Color, color, colorDiff };

//import * as cctData from './src/common/locus_10nm.json';
import { cctData } from "./src/misc/locus_10nm.js";
export { cctData };

import { daylightLocusData } from "./src/misc/daylightlocus_10nm.js";
export { daylightLocusData };

import { cmfs1931Data } from "./src/misc/cmfs-cie1931xyz-2deg.js";
export { cmfs1931Data };

// export { srgb } from "./src/spaces/rgb/index.js";

import "./src/defaults.js";

export { mmult3331, mmult3333, minv, mmult, quantize, roundHTE, hexFromArray, arrayEquals } from "./src/common/util.js";
