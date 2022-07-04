/* Gamma-compressed signal RGB values (non-linear) */
/* TODO: Gamut mapping */

import { ColorGamut } from '../../ColorGamut/ColorGamut';
import { ColorSpace } from '../ColorSpace';
import { mmult3331 } from '../../common/util';
import { ToneResponse } from '../../ToneResponse/ToneResponse';
import { XYZSpace } from '../XYZ/XYZSpace';

class RGBSpace extends ColorSpace {
	public name: string = 'RGB ColorSpace';
	constructor(
		public gamut: ColorGamut,
		public trc: ToneResponse
	) {
		super(['R', 'G', 'B']);

		this.addConversion(XYZSpace.defaultSpace,
			//RGB->XYZ
			(rgb: number[], options: {whiteY?: number, blackY?: number, linear?: boolean, gamut?: ColorGamut, trc?: ToneResponse} = {}) => {
				const { gamut = this.gamut, trc = this.trc, whiteY = gamut.whiteLevel(), blackY = gamut.blackLevel(), linear = false } = options;
				const RGB = linear? rgb.map(u => (whiteY-blackY)*u+blackY) : rgb.map(u => trc.eotf(u, {whiteY, blackY}));
				const XYZ = mmult3331(gamut.mXYZ, RGB);
				return XYZ;
			},
			//XYZ->RGB
			(XYZ: number[], options: {whiteY?: number, blackY?: number, linear?: boolean, gamut?: ColorGamut, trc?: ToneResponse} = {}) => {
				const { gamut = this.gamut, trc = this.trc, whiteY = gamut.whiteLevel(), blackY = gamut.blackLevel(), linear = false } = options;
				const RGB = mmult3331(gamut.mRGB, XYZ);
				const rgb = linear? RGB.map(u => (u-blackY)/(whiteY-blackY)) : RGB.map(u => trc.invEotf(u, {whiteY, blackY}));
				return rgb;
			})

	}
}


import { rgbSpaces } from './StandardRGBSpaces';
RGBSpace.defaultSpace = rgbSpaces.SRGB;
Object.defineProperty(ColorSpace.list, "RGB", { get: () => RGBSpace.defaultSpace });

export { RGBSpace };