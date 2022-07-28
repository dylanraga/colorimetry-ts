/*====================*/
/* Author: Dylan Raga */
/*====================*/

export { XYZSpace } from './modules/space/xyz';
export { xyzSpaces } from './modules/space/xyz.standard';

export { RGBSpace } from './modules/space/rgb';
export { rgbSpaces } from './modules/space/rgb.standard';

export { ChromaticitySpace } from './modules/space/chromaticity';
export { CHROMATICITY_XY } from './modules/space/chromaticity/xy';
export { CHROMATICITY_UV } from './modules/space/chromaticity/uv';

export { LabSpace } from './modules/space/lab';
export { LABSPACE_CIEYXY } from './modules/space/lab/cieyxy';
export { LABSPACE_CIELUV } from './modules/space/lab/cieluv';
export { LABSPACE_ITP } from './modules/space/lab/ictcp';
export { LABSPACE_JZAZBZ } from './modules/space/lab/jzazbz';


export { ColorSpace, ColorSpaceName } from './modules/space';

export { ColorGamut } from './modules/gamut';
export { ToneResponse } from './modules/trc';
//export * as ColorDifference from './modules/ColorDifference';
export { curves } from './modules/trc.standard';
export { gamuts } from './modules/gamut.standard';
export { illuminants } from './modules/illuminants';

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
