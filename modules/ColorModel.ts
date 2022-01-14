/*================================*/
/* Color Models & Representations */
/*================================*/

import { TransferFunction, TransferFunctionOptions } from 'ToneResponse.js';
import ColorSpace from './ColorSpace.js';
import { bfsPath, mmult } from './util.js';

class ColorModel {
	[key: string]: any;
	#type: string;

	constructor(type: ColorModelTypeString, data: ColorModelType) {
		if (!ColorModel.types.includes(type))	throw new Error(`ColorModel type '${type}' does not exist`);
		this.#type = type;
		
		for (let k in data) {
			this[k] = data[k];
		}
	}

	//Direct conversions from type to type
	static typeMap = {
		'RGB': ['XYZ', 'rgb'],
		'rgb': ['RGB'],
		'XYZ': ['RGB', 'xyY'],
		'xyY': ['xy', 'XYZ'],
		'xy': []
	};

	static types = [
		'XYZ',
		'xy',
		'xyY',
		'RGB',
		'rgb'
	] as const;
	
	/*
	 *	Member methods
	 */

	to(toType: ColorModelTypeString, colorSpace: ColorSpace) {
		let fromType = this.#type;
		if(!ColorModel.types.includes(toType))	throw new Error(`ColorModel type '${toType}' does not exist`);
		if(fromType === toType)	return this;

		switch (fromType) {
			case 'XYZ':
				switch (toType) {
					//XYZ -> RGB
					case 'RGB': {
						let [R, G, B] = mmult(colorSpace.gamut.mRGB, [this.X, this.Y, this.Z]);
						return new ColorModel('RGB', {R, G, B});
					} break;
				}
			break;
			case 'RGB':
				switch (toType) {	
					//RGB -> rgb
					case 'rgb': {
						let [r, g, b] = [this.R, this.G, this.B].map(u=> colorSpace.trc.oetf(u, {Lw: colorSpace.whiteLevel(), Lb: colorSpace.blackLevel()}));
						return new ColorModel('rgb', {r, g, b});
					} break;
					//RGB -> XYZ
					case 'XYZ': {
						let [X, Y, Z] = mmult(colorSpace.gamut.mXYZ, [this.R, this.G, this.B]);
						return new ColorModel('XYZ', {X, Y, Z});
					} break;
				}
			break;
			case 'rgb':
				switch (toType) {
					//rgb -> RGB
					case 'RGB': {
						let [R, G, B] = [this.r, this.g, this.b].map(u=> colorSpace.trc.eotf(u, {Lw: colorSpace.whiteLevel(), Lb: colorSpace.blackLevel()}));
						return new ColorModel('RGB', {R, G, B});
					} break;
				}
			break;
		}

		//If no direct conversion:
		//Use BFS shortest path fromType -> toType
		let path = bfsPath(fromType, toType, ColorModel.typeMap).slice(1);
		if (path.length === 0) throw new Error(`Cannot convert from ColorModel type '${fromType}' to '${toType}'`);
		let newType: ColorModel = this;
		for (let k of path) {
			newType = newType.to(k, colorSpace);
			console.log(colorSpace.whiteLevel());
		}
		return newType;

	}

	//returns the ColorModel type that matches the keys in the object input
	static matchObj(obj: ColorModelType): ColorModelTypeString {
		let keys = Object.keys(obj);

		return this.types.find(type => type.split('').sort().join('') === keys.sort().join(''));
	}	
}

interface XYZ {
	X: number;
	Y: number;
	Z: number;
}

interface xyY {
	x: number;
	y: number;
	Y: number;
}
type xy = Omit<xyY, 'Y'>;

//Linear light RGB
interface RGB{
	R: number;
	G: number;
	B: number;
}

//Non-linear signal rgb
interface rgb {
	r: number;
	g: number;
	b: number;
}

export type ColorModelTypeString = typeof ColorModel.types[number];
export type ColorModelType = RGB | rgb | XYZ | xyY;
export { XYZ, xy, xyY, RGB, rgb }
export default ColorModel;