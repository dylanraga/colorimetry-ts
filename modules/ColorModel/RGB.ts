import ColorModel, { ColorModelObj } from '../ColorModel.js';
import ColorSpace from '../ColorSpace.js';
import { mmult } from '../common/util.js';

//Linear light RGB
interface RGB{
	R: number;
	G: number;
	B: number;
}

ColorModel.types.RGB = {
	keys: ['R', 'G', 'B'],
	convertFns: {
		'XYZ': (RGB: number[], colorSpace: ColorSpace) => {
			let XYZ = mmult(colorSpace.gamut.mXYZ, RGB); //.map(u => Decimal(u).times(colorSpace.whiteLevel()));
			return XYZ;
		},
		'rgb': (RGB: number[], colorSpace: ColorSpace) => {
			let rgb = RGB.map(u=> colorSpace.trc.oetf(u, {Lw: colorSpace.whiteLevel(), Lb: colorSpace.blackLevel()}));
			return rgb;
		}
	}
}

ColorModel.types.XYZ.convertFns.RGB = (XYZ: number[], colorSpace: ColorSpace) => {
	let RGB = mmult(colorSpace.gamut.mRGB, XYZ); //.map(u => Decimal(u).div(colorSpace.whiteLevel()));
	return RGB;
};


//Non-linear signal rgb
interface rgb {
	r: number;
	g: number;
	b: number;
}

ColorModel.types.rgb = {
	keys: ['r', 'g', 'b'],
	convertFns: {
		'RGB': (rgb: number[], colorSpace: ColorSpace) => {
			let RGB = rgb.map(u=> colorSpace.trc.eotf(u, {Lw: colorSpace.whiteLevel(), Lb: colorSpace.blackLevel()}));
			return RGB;
		}
	}
}


export { RGB, rgb };