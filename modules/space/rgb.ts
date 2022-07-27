/* Gamma-compressed signal RGB values (non-isLinear) */
/* TODO: Gamut mapping */

import { ColorGamut } from '../gamut';
import { ColorSpace } from '../space';
import { mmult3331 as mmult, quantizeToBits } from '../common/util';
import { ToneResponse } from '../trc';
import { XYZSPACE_CIED65 } from './xyz.standard';

class RGBSpace extends ColorSpace {
	public name: string = 'RGB ColorSpace';
	public key: string[] = ['R', 'G', 'B'];
	public gamut: ColorGamut;
	public trc: ToneResponse;
	public bitDepth: 8 | 10 | 12 = 8;
	public isLinear: boolean = false;
	
	constructor(gamut: ColorGamut, trc: ToneResponse) {
		super();
		this.gamut = gamut;
		this.trc = trc;

		this.addConversion(XYZSPACE_CIED65,
			//RGB->XYZ
			(rgb: number[], props: Partial<RGBSpaceProps> = {}) => {
				const { gamut = this.gamut, trc = this.trc, bitDepth = this.bitDepth, isLinear = this.isLinear, whiteLevel, blackLevel } = props;
				return RGB_to_XYZ(rgb, { gamut, trc, isLinear, bitDepth, whiteLevel, blackLevel })
			},
			//XYZ->RGB
			(XYZ: number[], props: Partial<RGBSpaceProps> = {}) => {
				const { gamut = this.gamut, trc = this.trc, bitDepth = this.bitDepth, isLinear = this.isLinear, whiteLevel, blackLevel } = props;
				return XYZ_to_RGB(XYZ, { gamut, trc, isLinear, bitDepth, whiteLevel, blackLevel });
			}
		);
	}
}

interface RGBSpaceProps {
	gamut: ColorGamut;
	trc: ToneResponse;
	bitDepth: 8 | 10 | 12;
	isLinear: boolean;
	whiteLevel?: number;
	blackLevel?: number;
};

function RGB_to_XYZ(RGB: number[], props: RGBSpaceProps) {
	const { gamut, trc, isLinear, whiteLevel = gamut.whiteLevel, blackLevel = gamut.blackLevel } = props;
	
	RGB = (isLinear)
		? RGB.map(u => (whiteLevel-blackLevel)*u+blackLevel)
		: RGB.map(u => trc.eotf(u, { whiteLevel, blackLevel }));
	
	const XYZ = mmult(gamut.mXYZ, RGB);
	return XYZ;
}

function XYZ_to_RGB(XYZ: number[], props: RGBSpaceProps) {
	const { gamut, trc, isLinear, whiteLevel = gamut.whiteLevel, blackLevel = gamut.blackLevel } = props;
	
	let RGB = mmult(gamut.mRGB, XYZ);
	
	RGB = (isLinear)
		? RGB.map(u => (u-blackLevel)/(whiteLevel-blackLevel))
		: RGB.map(u => trc.invEotf(u, { whiteLevel, blackLevel }));
	
	return RGB;
}



export { RGBSpace };