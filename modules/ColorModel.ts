/*================================*/
/* Color Models & Representations */
/*================================*/

import { TransferFunction, TransferFunctionOptions } from 'ToneResponse.js';
import { ToneResponse } from '../colorimetry.js';
import ColorSpace from './ColorSpace.js';
import { bfsPath, minv, mmult } from './util.js';

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
		'XYZ': ['RGB', 'xyY', 'xy', 'ITP'],
		'xyY': ['xy', 'XYZ'],
		'xy':  ['xyY', 'XYZ'],
		'ITP': ['XYZ']
	};

	static types = [
		'XYZ',
		'xy',
		'xyY',
		'RGB',
		'rgb',
		'ITP'
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
					}
					//XYZ -> xyY
					case 'xyY': {
						let [x, y] = [this.X/(this.X+this.Y+this.Z), this.Y/(this.X+this.Y+this.Z)];
						return new ColorModel('xyY', {x, y, Y: this.Y});
					}
					//XYZ -> xy
					case 'xy': {
						let [x, y] = [this.X/(this.X+this.Y+this.Z), this.Y/(this.X+this.Y+this.Z)];
						return new ColorModel('xy', {x, y});
					}
					//XYZ -> ITP
					case 'ITP': {
						let [I, T, P] = XYZ_to_ITP(this.X, this.Y, this.Z);
						return new ColorModel('ITP', {I, T, P});
					}
				}
			break;
			case 'RGB':
				switch (toType) {	
					//RGB -> rgb
					case 'rgb': {
						let [r, g, b] = [this.R, this.G, this.B].map(u=> colorSpace.trc.oetf(u, {Lw: colorSpace.whiteLevel(), Lb: colorSpace.blackLevel()}));
						return new ColorModel('rgb', {r, g, b});
					}
					//RGB -> XYZ
					case 'XYZ': {
						console.log('test');
						let [X, Y, Z] = mmult(colorSpace.gamut.mXYZ, [this.R, this.G, this.B]);
						return new ColorModel('XYZ', {X, Y, Z});
					}
				}
			case 'rgb':
				switch (toType) {
					//rgb -> RGB
					case 'RGB': {
						let [R, G, B] = [this.r, this.g, this.b].map(u=> colorSpace.trc.eotf(u, {Lw: colorSpace.whiteLevel(), Lb: colorSpace.blackLevel()}));
						return new ColorModel('RGB', {R, G, B});
					}
				}
			break;
			case 'xy':
				switch (toType) {
					//xy -> xyY
					case 'xyY': {
						let [x, y, Y] = [this.x, this.y, colorSpace.whiteLevel()]
						return new ColorModel('xyY', {x, y, Y});
					}
					//xy -> XYZ
					case 'XYZ': {
						let Y = colorSpace.whiteLevel();
						let [X, Z] = [this.x*Y/this.y, (1-this.x-this.y)*Y/this.y];
						return new ColorModel('XYZ', {X, Y, Z});
					}
				}
			break;
			case 'ITP':
				switch (toType) {
					case 'XYZ': {
						let [X, Y, Z] = ITP_to_XYZ(this.I, this.T, this.P);
						return new ColorModel('XYZ', {X, Y, Z});
					}
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

/* Color Representations */

interface ICtCp {
	I: number;
	Ct: number;
	Cp: number;
}

interface ITP {
	I: number;
	T: number;
	P: number;
}

const mVonKries = [
	[0.400240, 0.7076000, -0.0808100],
	[-0.2263000, 1.1653200, 0.0457000],
	[0.0000000, 0.0000000, 0.9182200]
];

const mEbner = [
	[0.5, 0.5, 0],
	[4.4550, -4.8510, 0.3960],
	[0.8056, 0.3572, -1.1628]
]

function ITP_to_XYZ(I: number, T: number, P: number): number[] {
	let Ct = 2 * T;
	let Cp = P;
	//let mL_M_S_ = minv(mICtCp);
	let mL_M_S_ = [
		[1, 0.00860647526296102, 0.111033530626673],
		[1, -0.00860647526296102, -0.111033530626673],
		[1, 0.560046305787238, -0.32063195658016]
	]
	let [L_, M_, S_] = mmult(mL_M_S_, [I, Ct, Cp]);
	let L = ToneResponse.PQ.eotf(L_);
	let M = ToneResponse.PQ.eotf(M_);
	let S = ToneResponse.PQ.eotf(S_);	

	//let mXYZ = minv(mLMS);
	let mXYZ = [
		[2.07036170490565, -1.32659057468064, 0.20668104824695],
		[0.364990380777918, 0.68046882059982, -0.0454616724477699],
		[-0.0495028919589483, -0.0495028919589481, 1.18806940701476]
	];
	let [X, Y, Z] = mmult(mXYZ, [L, M, S]);

	return [X ,Y, Z];
}

function XYZ_to_ITP(X: number, Y: number, Z: number): number[] {

	/*
	let C = 0.04;
	let mCrossTalk = [[1-2*C, C, C], [C, 1-2*C, C], [C, C, 1-2*C]];
	let mLMS = mmult(mCrossTalk, mVonKries);
	*/
	
	let mLMS = [
		[0.3591688, 0.6976048, -0.0357884],
		[-0.1921864, 1.1003984, 0.0755404],
		[0.0069576, 0.0749168, 0.843358]
	];
	
	let [L, M, S] = mmult(mLMS, [X, Y, Z]);

	let L_ = ToneResponse.PQ.oetf(L);
	let M_ = ToneResponse.PQ.oetf(M);
	let S_ = ToneResponse.PQ.oetf(S);

	/*
	let alpha = 1.134464;
	let rotation = [[1, 0, 0],[0, +Math.cos(alpha).toPrecision(15), -Math.sin(alpha).toPrecision(15)],[0, +Math.sin(alpha).toPrecision(15), +Math.cos(alpha).toPrecision(15)]];
	let scalar = [[1, 1, 1],[1.4, 1.4, 1.4],[1, 1, 1]];
	let mICtCp = mmult(rotation, mEbner).map((u,i) => u.map((w,j) => +(w*scalar[i][j]).toPrecision(15)));
	*/
	
	let mICtCp = [
		[0.5, 0.5, 0],
		[1.61370000850691, -3.323396142929, 1.70969613442208],
		[4.37806244700435, -4.24553979907057, -0.132522647933791]
	];
	let [I, Ct, Cp] = mmult(mICtCp, [L_, M_, S_]);

	let T = 0.5 * Ct;
	let P = Cp;	
	return [I, T, P];
}

export type ColorModelTypeString = typeof ColorModel.types[number];
export type ColorModelType = RGB | rgb | XYZ | xyY | xy | ITP;
export { XYZ, xy, xyY, RGB, rgb }
export default ColorModel;