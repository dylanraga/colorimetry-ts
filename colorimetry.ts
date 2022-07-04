/*====================*/
/* Author: Dylan Raga */
/*====================*/

/* ColorModels */
//Essentials
//import './modules/ColorSpace/LAB/CIExyY';
//Optionals
//import './modules/ColorSpace/LAB/CIELAB';
//import './modules/ColorSpace/LAB/CIELUV';
//import './modules/ColorSpace/LAB/ICtCp';
//import './modules/ColorSpace/LAB/JzAzBz';
//import './modules/ColorModel/LCh';
//defaults
//import './modules/ColorModel/RGB/spaces';

export { ColorSpace } from './modules/ColorSpace/ColorSpace';
export { ColorGamut } from './modules/ColorGamut/ColorGamut';
export { ToneResponse } from './modules/ToneResponse/ToneResponse';
export { Color } from './modules/Color';
//export * as ColorDifference from './modules/ColorDifference';
export { curves } from './modules/ToneResponse/StandardToneResponses';
export { gamuts } from './modules/ColorGamut/StandardColorGamuts';

export { XYZSpace } from './modules/ColorSpace/XYZ/XYZSpace';
export { xyzSpaces } from './modules/ColorSpace/XYZ/StandardXYZSpaces';

export { RGBSpace } from './modules/ColorSpace/RGB/RGBSpace';
export { rgbSpaces } from './modules/ColorSpace/RGB/StandardRGBSpaces';

export { LabSpace } from './modules/ColorSpace/Lab/LabSpace';
export { LABSPACE_ITP } from './modules/ColorSpace/Lab/ICtCp';
export { LABSPACE_JZAZBZ } from './modules/ColorSpace/Lab/JzAzBz';

export { mmult3331, minv, mmult } from './modules/common/util';
