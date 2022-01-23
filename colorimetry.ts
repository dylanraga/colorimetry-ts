/*====================*/
/* Author: Dylan Raga */
/*====================*/

export { default as ColorSpace } from './modules/ColorSpace.js';
export { default as ColorModel } from './modules/ColorModel.js';
export { default as ColorGamut } from './modules/ColorGamut.js';
export { default as ToneResponse } from './modules/ToneResponse.js';
export { default as Color } from './modules/Color.js';

/* ColorModels */
//Essentials
import './modules/ColorModel/CIEXYZ.js';
import './modules/ColorModel/RGB.js';
//Optionals
import './modules/ColorModel/CIELAB.js';
import './modules/ColorModel/CIELUV.js';
import './modules/ColorModel/ICtCp.js';