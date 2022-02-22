/* Gamma-compressed signal RGB values (non-linear) */
/* TODO: Gamut mapping */

import ColorGamut from '../ColorGamut.js';
import ColorModel from '../ColorModel.js';
import ColorSpace, { ColorSpaceConversion } from '../ColorSpace.js';
import { mmult } from '../common/util.js';
import ToneResponse from '../ToneResponse.js';

ColorModel.types.RGB = new ColorModel('RGB', ['R', 'G', 'B']);

interface RGBColorSpace {
	gamut?: ColorGamut;
	trc?: ToneResponse
}

const RGBConversion = ({gamut = ColorGamut.SRGB, trc = ToneResponse.SRGB}: RGBColorSpace = {}): ColorSpaceConversion[] => {
	let _gamut = gamut;
	let _trc = trc;
	return [
		{
			space: ColorModel.types.XYZ,
			//XYZ -> RGB
			from: (XYZ: number[], options: {Lw?: number, Lb?: number, linear?: boolean, gamut?: ColorGamut, trc?: ToneResponse} = {}) => {
				const { gamut = _gamut, trc = _trc, Lw = gamut.whiteLevel(), Lb = gamut.blackLevel(), linear = false } = options;
				let RGB = mmult(gamut.mRGB, XYZ);
				let rgb = linear? RGB.map(u => (u-Lb)/(Lw-Lb)) : RGB.map(u => trc.oetf(u, {Lw, Lb}));
				return rgb;
			},
			//RGB -> XYZ
			to: (rgb: number[], options: {Lw?: number, Lb?: number, linear?: boolean, gamut?: ColorGamut, trc?: ToneResponse} = {}) => {
				const { gamut = _gamut, trc = _trc, Lw = gamut.whiteLevel(), Lb = gamut.blackLevel(), linear = false } = options;
				let RGB = linear? rgb.map(u => (Lw-Lb)*u+Lb) : rgb.map(u => trc.eotf(u, {Lw, Lb}));
				let XYZ = mmult(gamut.mXYZ, RGB); //.map(u => Decimal(u).times(colorSpace.whiteLevel()));
				return XYZ;
			}
		}
	];
}
ColorSpace.RGBConversion = RGBConversion;

/*
 * RGB ColorSpaces
 */

//sRGB
const SRGB = new ColorSpace(ColorModel.types.RGB, RGBConversion());
SRGB.name = 'SRGB';
ColorModel.types.RGB.spaces.SRGB = SRGB;
ColorModel.types.RGB.defaultSpace = SRGB;

//Rec.709
const REC709 = new ColorSpace(ColorModel.types.RGB, RGBConversion({
	gamut: ColorGamut.SRGB.whiteLevel(100),
	trc: ToneResponse.BT1886
}));
REC709.name = 'REC709';
REC709.alias.push('BT709');
ColorModel.types.RGB.spaces.REC709 = REC709;

//Display P3
const DISPLAYP3 = new ColorSpace(ColorModel.types.RGB, RGBConversion({
	gamut: ColorGamut.P3D65,
	trc: ToneResponse.SRGB
}));
DISPLAYP3.name = 'DISPLAYP3';
DISPLAYP3.alias.push('P3', 'DISPLAY P3');
ColorModel.types.RGB.spaces.DISPLAYP3 = DISPLAYP3;

//DCI-P3
const DCIP3 = new ColorSpace(ColorModel.types.RGB, RGBConversion({
	gamut: ColorGamut.P3D65.whiteLevel(48),
	trc: ToneResponse.GAMMA.options({gamma: 2.6})
}));
DCIP3.name = 'DCIP3';
DCIP3.alias.push('DCI-P3');
ColorModel.types.RGB.spaces.DCIP3 = DCIP3;

//BT2100 (PQ)
const BT2100_PQ = new ColorSpace(ColorModel.types.RGB, RGBConversion({
	gamut: ColorGamut.BT2020.whiteLevel(10000),
	trc: ToneResponse.ST2084
}));
BT2100_PQ.name = 'BT2100 PQ';
BT2100_PQ.alias.push('BT2100', 'REC2100');
ColorModel.types.RGB.spaces.BT2100_PQ = BT2100_PQ;

//BT2100 (HLG)
const BT2100_HLG = new ColorSpace(ColorModel.types.RGB, RGBConversion({
	gamut: ColorGamut.BT2020.whiteLevel(1000),
	trc: ToneResponse.HLG
}));
BT2100_HLG.name = 'BT2100 HLG';
ColorModel.types.RGB.spaces.BT2100_HLG = BT2100_HLG;