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
export { LABSPACE_CIE1931 } from './modules/space/lab/cie1931';
export { LABSPACE_CIELUV } from './modules/space/lab/cieluv';
export { LABSPACE_ITP } from './modules/space/lab/ictcp';
export { LABSPACE_JZAZBZ } from './modules/space/lab/jzazbz';

export { ColorSpace } from './modules/space';
export { ColorGamut } from './modules/gamut';
export { ToneResponse } from './modules/trc';
export { Color } from './modules/color';
//export * as ColorDifference from './modules/ColorDifference';
export { curves } from './modules/trc.standard';
export { gamuts } from './modules/gamut.standard';
export { illuminants } from './modules/illuminants';

import './modules/difference';
import './modules/color/luminance';
import './modules/color/luma';
import './modules/color/cct';
import * as cctData from './modules/common/locus_10nm.json';
export { cctData };

import './modules/defaults';

export { mmult3331, minv, mmult } from './modules/common/util';
