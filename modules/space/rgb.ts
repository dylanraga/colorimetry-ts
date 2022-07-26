/* Gamma-compressed signal RGB values (non-linear) */
/* TODO: Gamut mapping */

import { ColorGamut } from '../gamut';
import { ColorSpace } from '../space';
import { mmult3331 as mmult } from '../common/util';
import { ToneResponse } from '../trc';
import { XYZSPACE_CIED65 } from './xyz.standard';

class RGBSpace extends ColorSpace {
	public name: string = 'RGB ColorSpace';
	public key: string[] = ['R', 'G', 'B'];
	public gamut: ColorGamut;
	public trc: ToneResponse;
	public linear: boolean = false;
	
	constructor(gamut: ColorGamut, trc: ToneResponse) {
		super();
		this.gamut = gamut;
		this.trc = trc;

		this.addConversion(XYZSPACE_CIED65,
			//RGB->XYZ
			(rgb: number[], props: Partial<RGBSpaceProps> = {}) => {
				const { gamut = this.gamut, trc = this.trc, linear = this.linear, whiteLevel, blackLevel } = props;
				return RGB_to_XYZ(rgb, { gamut, trc, linear , whiteLevel, blackLevel })
			},
			//XYZ->RGB
			(XYZ: number[], props: Partial<RGBSpaceProps> = {}) => {
				const { gamut = this.gamut, trc = this.trc, linear = this.linear, whiteLevel, blackLevel } = props;
				return XYZ_to_RGB(XYZ, { gamut, trc, linear , whiteLevel, blackLevel });
			}
		);
	}
}

interface RGBSpaceProps {
	gamut: ColorGamut;
	trc: ToneResponse;
	linear: boolean;
	whiteLevel?: number;
	blackLevel?: number;
};

function RGB_to_XYZ(rgb: number[], props: RGBSpaceProps) {
	const { gamut, trc, linear, whiteLevel = gamut.whiteLevel, blackLevel = gamut.blackLevel } = props;
	
	const RGB = linear? rgb.map(u => (whiteLevel-blackLevel)*u+blackLevel) : rgb.map(u => trc.eotf(u, { whiteLevel, blackLevel }));
	const XYZ = mmult(gamut.mXYZ, RGB);
	return XYZ;
}

function XYZ_to_RGB(XYZ: number[], props: RGBSpaceProps) {
	const { gamut, trc, linear, whiteLevel = gamut.whiteLevel, blackLevel = gamut.blackLevel } = props;
	
	const RGB = mmult(gamut.mRGB, XYZ);
	const rgb = linear? RGB.map(u => (u-blackLevel)/(whiteLevel-blackLevel)) : RGB.map(u => trc.invEotf(u, { whiteLevel, blackLevel }));
	return rgb;
}



export { RGBSpace };