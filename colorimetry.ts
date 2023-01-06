/*====================*/
/* Author: Dylan Raga */
/*====================*/

import { ColorGamut, ColorGamutPrimaries, gamuts } from "./src/gamut.js";
import "./src/gamut/predefined.js";
export { ColorGamut, ColorGamutPrimaries, gamuts };

import * as curves from "./src/trc/index.js";
export { curves };

import * as illuminants from "./src/illuminant/predefined.js";
export { illuminants };

import { xyzCat } from "./src/cat.js";
export { xyzCat };

import { XYZSpace, xyzSpaces } from "./src/space/xyz.js";
import "./src/space/xyz/predefined.js";
export { XYZSpace, xyzSpaces };

import { RGBLinearSpace, rgbLinearSpaces } from "./src/space/rgb-linear.js";
import "./src/space/rgb-linear/predefined.js";
export { RGBLinearSpace, rgbLinearSpaces };

import { RGBEncodedSpace, rgbSpaces } from "./src/space/rgb-encoded.js";
import "./src/space/rgb-encoded/predefined.js";
export { RGBEncodedSpace, rgbSpaces };

import { ChromaticitySpace } from "./src/space/chromaticity.js";
import * as chromaticitySpaces from "./src/space/chromaticity/predefined.js";
export { ChromaticitySpace, chromaticitySpaces };

import { LabSpace, labSpaces } from "./src/space/lab.js";
import "./src/space/lab/predefined.js";
export { LabSpace, labSpaces };

import { ColorSpace, ColorSpaceName, spaces } from "./src/space.js";
export { ColorSpace, ColorSpaceName, spaces };

import { Color } from "./src/color.js";
import "./src/difference/predefined.js";
import "./src/difference.js";
import "./src/color/luminance.js";
import "./src/color/luma.js";
import "./src/color/cct.js";
export { Color };

//import * as cctData from './src/common/locus_10nm.json';
import { cctData } from "./src/misc/locus_10nm.js";
export { cctData };

import { daylightLocusData } from "./src/misc/daylightlocus_10nm.js";
export { daylightLocusData };

import { cmfs1931Data } from "./src/misc/cmfs-cie1931xyz-2deg.js";
export { cmfs1931Data };

import "./src/defaults.js";

export { mmult3331, mmult3333, minv, mmult, quantizeToBits, roundHTE } from "./src/common/util.js";
