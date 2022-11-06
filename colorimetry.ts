/*====================*/
/* Author: Dylan Raga */
/*====================*/

import { ColorGamut, ColorGamutPrimaries, gamuts } from './modules/gamut.js';
import './modules/gamut/predefined.js';
export { ColorGamut, ColorGamutPrimaries, gamuts };

import { ToneResponse, curves } from './modules/trc.js';
import './modules/trc/predefined.js';
export { ToneResponse, curves };

import { illuminants } from './modules/illuminants/predefined.js';
export { illuminants };

import { xyzCat } from './modules/cat.js';
export { xyzCat };

import { XYZSpace, xyzSpaces } from './modules/space/xyz.js';
import './modules/space/xyz/predefined.js';
export { XYZSpace, xyzSpaces };

import { RGBLinearSpace, rgbLinearSpaces } from './modules/space/rgb-linear.js';
import './modules/space/rgb-linear/predefined.js';
export { RGBLinearSpace, rgbLinearSpaces };

import { RGBEncodedSpace, rgbSpaces } from './modules/space/rgb-encoded.js';
import './modules/space/rgb-encoded/predefined.js';
export { RGBEncodedSpace, rgbSpaces };

import {
	ChromaticitySpace,
	chromaticitySpaces,
} from './modules/space/chromaticity.js';
import './modules/space/chromaticity/predefined.js';
export { ChromaticitySpace, chromaticitySpaces };

import { LabSpace, labSpaces } from './modules/space/lab.js';
import './modules/space/lab/predefined.js';
export { LabSpace, labSpaces };

import { ColorSpace, ColorSpaceName, spaces } from './modules/space.js';
export { ColorSpace, ColorSpaceName, spaces };

import { Color } from './modules/color.js';
import './modules/difference/predefined.js';
import './modules/difference.js';
import './modules/color/luminance.js';
import './modules/color/luma.js';
import './modules/color/cct.js';
export { Color };

//import * as cctData from './modules/common/locus_10nm.json';
import { cctData } from './modules/common/locus_10nm.js';
export { cctData };

import { daylightLocusData } from './modules/common/daylightlocus_10nm.js';
export { daylightLocusData };

import { cmfs1931Data } from './modules/misc/cmfs-cie1931xyz-2deg.js';
export { cmfs1931Data };

import './modules/defaults.js';

export {
	mmult3331,
	mmult3333,
	minv,
	mmult,
	quantizeToBits,
	roundHTE,
} from './modules/common/util.js';
