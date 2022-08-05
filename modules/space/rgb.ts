/* Gamma-compressed signal RGB values (non-isLinear) */
/* TODO: Gamut mapping */

import { ColorGamut, ColorGamutName, gamuts } from '../gamut';
import { ColorSpace } from '../space';
import { mmult3331 as mmult } from '../common/util';
import { curves, ToneResponse, ToneResponseName } from '../trc';
import { XYZSPACE_D65 } from './xyz.standard';

class RGBSpace extends ColorSpace {
	public name: string = 'RGB ColorSpace';
	public key: string[] = ['R', 'G', 'B'];
	public gamut: ColorGamut;
	public trc: ToneResponse<any>;
	public bitDepth: 8 | 10 | 12 = 8;
	public isLinear = false;
	public static defaultSpace: RGBSpace;
	
	constructor(_gamut: ColorGamut | ColorGamutName, _trc: ToneResponse<any> | ToneResponseName) {
		super();

		const gamut = typeof _gamut === 'string'? gamuts[_gamut] : _gamut;
		const trc = typeof _trc === 'string'? curves[_trc] : _trc;

		this.gamut = gamut;
		this.trc = trc;

		this.addConversion<RGBSpaceProps>(XYZSPACE_D65,
			//RGB->XYZ
			(RGB, { gamut = this.gamut, trc = this.trc, bitDepth = this.bitDepth, isLinear = this.isLinear }) => RGB_to_XYZ(RGB, { gamut, trc, bitDepth, isLinear }),
			//XYZ->RGB
			(XYZ, { gamut = this.gamut, trc = this.trc, bitDepth = this.bitDepth, isLinear = this.isLinear }) => XYZ_to_RGB(XYZ, { gamut, trc, bitDepth, isLinear }),
		);
	}

	public register(nameList: string[]): void;
	public register(name: string): void;
	public register(arg1: string | string[]): void {
		const strings = typeof arg1 === 'string'? [arg1] : arg1;
		
		super.register(strings);
		for (const name of strings) {
			RGBSpace.named[name] = this;
		}
	}
}

interface RGBSpaceProps {
	gamut: ColorGamut;
	trc: ToneResponse<any>;
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


export interface RGBSpaceNamedMap { }
export type RGBSpaceName = keyof RGBSpaceNamedMap | (string & Record<never, never>);

declare module '../space' {
	interface ColorSpaceNamedMap extends RGBSpaceNamedMap {}
}

type RGBSpaceNamedMapType = RGBSpaceNamedMap & { [k: string]: RGBSpace };
export const rgbSpaces = RGBSpace.named as RGBSpaceNamedMapType;

export { RGBSpace };