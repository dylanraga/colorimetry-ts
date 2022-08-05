/*====================*/
/* Author: Dylan Raga */
/*====================*/

export { ColorGamut, gamuts } from './modules/gamut';
import './modules/gamut.standard';

export { ToneResponse, curves } from './modules/trc';
import './modules/trc.standard';

export { illuminants } from './modules/illuminants';

export { XYZSpace, xyzSpaces } from './modules/space/xyz';
import './modules/space/xyz.standard';

export { RGBSpace, rgbSpaces } from './modules/space/rgb';
import './modules/space/rgb.standard';

export { ChromaticitySpace, chromaticitySpaces } from './modules/space/chromaticity';
import './modules/space/chromaticity/xy';
import './modules/space/chromaticity/uv';

export { LabSpace, labSpaces } from './modules/space/lab';
import './modules/space/lab/cielab';
import './modules/space/lab/cieluv';
import './modules/space/lab/cieyxy';
import './modules/space/lab/ictcp';
import './modules/space/lab/jzazbz';
import './modules/space/lab/oklab';


export { ColorSpace, ColorSpaceName, spaces } from './modules/space';

import { Color } from './modules/color';
import './modules/difference';
import './modules/color/luminance';
import './modules/color/luma';
import './modules/color/cct';
export { Color };


import * as cctData from './modules/common/locus_10nm.json';
export { cctData };

import './modules/defaults';

export { mmult3331, minv, mmult, quantizeToBits, roundHTE } from './modules/common/util';
