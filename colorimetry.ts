/*====================*/
/* Author: Dylan Raga */
/*====================*/

export { ColorGamut, ColorGamutPrimaries, gamuts } from './modules/gamut.js';
import './modules/gamut/predefined.js';

export { ToneResponse, curves } from './modules/trc.js';
import './modules/trc/predefined.js';

export { illuminants } from './modules/illuminants/predefined.js';

export { xyzCat } from './modules/cat.js';

export { XYZSpace, xyzSpaces } from './modules/space/xyz.js';
import './modules/space/xyz/predefined.js';

export { RGBLinearSpace } from './modules/space/rgb-linear.js';
import './modules/space/rgb-linear/predefined.js';

export { RGBEncodedSpace } from './modules/space/rgb-encoded.js';
import './modules/space/rgb-encoded/predefined.js';

export { ChromaticitySpace, chromaticitySpaces } from './modules/space/chromaticity.js';
import './modules/space/chromaticity/predefined.js';

export { LabSpace, labSpaces } from './modules/space/lab.js';
import './modules/space/lab/predefined.js';

export { ColorSpace, ColorSpaceName, spaces } from './modules/space.js';

import { Color as ColorClass, ColorConstructor } from './modules/color.js';
import './modules/difference.js';
import './modules/difference/predefined.js';
import './modules/color/luminance.js';
import './modules/color/luma.js';
import './modules/color/cct.js';
export const Color = ColorClass as ColorConstructor;

//import * as cctData from './modules/common/locus_10nm.json';
//export { cctData };

import './modules/defaults.js';

export { mmult3331, mmult3333, minv, mmult, quantizeToBits, roundHTE } from './modules/common/util.js';
