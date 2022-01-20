/*================================*/
/* Color Models & Representations */
/*================================*/

import { TransferFunction, TransferFunctionOptions } from 'ToneResponse.js';
import { ToneResponse } from '../colorimetry.js';
import ColorSpace from './ColorSpace.js';
import { bfsPath, minv, mmult } from './util.js';
import Decimal from './decimal.mjs';
import ColorGamut from './ColorGamut.js';

class ColorModel {
	[key: string]: any;
	#type: string;

	constructor(type: string, data: ColorModelType|ColorModel) {
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
		'XYZ': ['RGB', 'xyY', 'xy', 'LUV', 'uv', 'ITP'],
		'xyY': ['xy', 'XYZ'],
		'xy':  ['uv'],
		'LUV': ['XYZ', 'uv'],
		'uv':  ['xy'],
		'ITP': ['XYZ']
	};

	static types = [
		'XYZ',
		'xy',
		'xyY',
		'RGB',
		'rgb',
		'LUV',
		'uv',
		'ITP'
	];
	
	/*
	 *	Member methods
	 */

	to(toType: string, options: {colorSpace?: ColorSpace}) {
		let fromType = this.#type;
		if(fromType === toType)	return this;
		const { colorSpace } = options;
		if(!ColorModel.types.includes(toType))	throw new Error(`ColorModel type '${toType}' does not exist`);

		switch (fromType) {
			case 'XYZ':
				const { X, Y, Z } = this;
				switch (toType) {
					//XYZ -> RGB
					case 'RGB': {
						let [R, G, B] = mmult(colorSpace.gamut.mRGB, [X, Y, Z]).map(u => Decimal(u).div(colorSpace.whiteLevel()));
						return new ColorModel('RGB', {R, G, B});
					}
					//XYZ -> xyY
					case 'xyY': {
						let [x, y] = [Decimal(X).div(Decimal(X).plus(Y).plus(Z)), Decimal(Y).div(Decimal(X).plus(Y).plus(Z))];
						return new ColorModel('xyY', {x, y, Y: this.Y});
					}
					//XYZ -> xy
					case 'xy': {
						let [x, y] = [Decimal(X).div(Decimal(X).plus(Y).plus(Z)), Decimal(Y).div(Decimal(X).plus(Y).plus(Z))]
						//let [x, y] = [this.X/(this.X+this.Y+this.Z), this.Y/(this.X+this.Y+this.Z)];
						return new ColorModel('xy', {x, y});
					}
					//XYZ -> uv
					case 'uv': {
						let [u, v] = XYZ_to_uv(X, Y, Z);
						return new ColorModel('uv', {u, v});
					}
					//XYZ -> LUV
					case 'LUV': {
						let [L, U, V] = XYZ_to_LUV(X, Y, Z);
						return new ColorModel('LUV', {L, U, V});
					}
					//XYZ -> ITP
					case 'ITP': {
						let [I, T, P] = XYZ_to_ITP(X, Y, Z);
						return new ColorModel('ITP', {I, T, P});
					}
				}
			break;
			case 'RGB':
				const { R, G, B } = this;
				switch (toType) {
					//RGB -> rgb
					case 'rgb': {
						let [r, g, b] = [R, G, B].map(u=> colorSpace.trc.oetf(u, {Lw: colorSpace.whiteLevel(), Lb: colorSpace.blackLevel()}));
						return new ColorModel('rgb', {r, g, b});
					}
					//RGB -> XYZ
					case 'XYZ': {
						let [X, Y, Z] = mmult(colorSpace.gamut.mXYZ, [R, G, B]).map(u => Decimal(u).times(colorSpace.whiteLevel()));
						return new ColorModel('XYZ', {X, Y, Z});
					}
				}
			case 'rgb':
				const { r, g, b } = this;
				switch (toType) {
					//rgb -> RGB
					case 'RGB': {
						let [R, G, B] = [r, g, b].map(u=> colorSpace.trc.eotf(u, {Lw: colorSpace.whiteLevel(), Lb: colorSpace.blackLevel()}));
						return new ColorModel('RGB', {R, G, B});
					}
				}
			break;
			case 'xy':
				const { x, y } = this;
				switch (toType) {
					//xy -> uv
					case 'uv': {
						let [u, v] = xy_to_uv(x, y);
						return new ColorModel('uv', {u, v});
					}
				}
			break;
			case 'LUV':
				const { L, U, V } = this;
				//LUV -> XYZ
				switch (toType) {
					case 'XYZ': {
						let [X, Y, Z] = LUV_to_XYZ(L, U, V);
						return new ColorModel('XYZ', {X, Y, Z});
					}
				}
			break;
			case 'ITP':
				const { I, T, P } = this;
				switch (toType) {
					//ITP -> XYZ
					case 'XYZ': {
						let [X, Y, Z] = ITP_to_XYZ(I, T, P);
						return new ColorModel('XYZ', {X, Y, Z});
					}
				}
			break;
		}

		//If no direct conversion:
		//Use BFS shortest path fromType -> toType
		//Convert through this path
		let path = bfsPath(fromType, toType, ColorModel.typeMap).slice(1);
		if (path.length === 0) throw new Error(`Cannot convert from ColorModel type '${fromType}' to '${toType}'`);
		let newType: ColorModel = this;
		for (let k of path) {
			newType = newType.to(k, {colorSpace});
		}
		return newType;

	}
	
	//Returns new ColorModel with Number data instead of Decimal
	toNumbers() {
		const newModel = new ColorModel(this.#type, this);
		for (const k of Object.keys(this)) {
			newModel[k] = +(+this[k]).toFixed(15);
		}
		return newModel;
	}

	//returns the ColorModel type that matches the keys in the object input
	static matchObj(obj: ColorModelType|ColorModel): ColorModelTypeString {
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

interface LUV {
	L: number;
	U: number;
	V: number;
}

interface uv {
	u: number;
	v: number;
}

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

/*
 * ColorModel Transformation Functions
 */

const mVonKries = [
	[0.400240, 0.7076000, -0.0808100],
	[-0.2263000, 1.1653200, 0.0457000],
	[0.0000000, 0.0000000, 0.9182200]
];

const mEbner = [
	[0.5, 0.5, 0],
	[4.4550, -4.8510, 0.3960],
	[0.8056, 0.3572, -1.1628]
];

function XYZ_to_uv(X: number, Y: number, Z: number): number[] {
	let [u, v] = [Decimal(X).times(4).div(Decimal(X).plus(Decimal(Y).times(15)).plus(Decimal(Z).times(3))), Decimal(Y).times(9).div(Decimal(X).plus(Decimal(Y).times(15)).plus(Decimal(Z).times(3)))];
	return [u, v];
}

function xy_to_uv(x: number, y: number): number[] {
	let [u, v] = [Decimal(x).times(4).div(Decimal(x).times(-2).plus(Decimal(y).times(12)).plus(3)), Decimal(y).times(9).div(Decimal(x).times(-2).plus(Decimal(y).times(12)).plus(3))];
	return [u, v];
}

function uv_to_xy(u: number, v: number): number[] {
	let [x, y] = [Decimal(u).times(9).div( Decimal(u).times(6).minus( Decimal(v).times(16) ).plus(12) ), Decimal(v).times(4).div( Decimal(u).times(6).minus( Decimal(v).times(16) ).plus(12) )];
	return [x, y];
}

function XYZ_to_LUV(X: number, Y: number, Z: number, white: xy = ColorGamut.SRGB.white): number[] {
	let [u, v] = XYZ_to_uv(X, Y, Z);
	let [un, vn] = xy_to_uv(white.x, white.y);
	let L = ToneResponse.LSTAR.oetf(Y/100);
	let U = Decimal(L).times(13).times(Decimal(u).minus(un));
	let V = Decimal(L).times(13).times(Decimal(v).minus(vn));

	return [L, U, V];
}

function LUV_to_XYZ(L: number, U: number, V: number, white: xy = ColorGamut.SRGB.white): number[] {
	let Y = ToneResponse.LSTAR.eotf(L);
	let [un, vn] = xy_to_uv(white.x, white.y);
	let u = Decimal(U).div(Decimal(L).times(13)).plus(un);
	let v = Decimal(V).div(Decimal(L).times(13)).plus(vn);
	let X = Decimal(Y).times( Decimal(u).times(9).div( Decimal(v).times(4) ) );
	let Z = Decimal(Y).times( Decimal(12).minus( Decimal(u).times(3) ).minus( Decimal(v).times(20) ).div( Decimal(v).times(4) ) );

	return [X, Y, Z];
}

function ITP_to_XYZ(I: number, T: number, P: number, trc: ToneResponse = ToneResponse.PQ): number[] {
	let Ct = Decimal(T).times(2);
	let Cp = P;
	//let mL_M_S_ = minv(mICtCp);
	let mL_M_S_ = [
		[1, 0.008606475262961264, 0.11103353062667286],
		[1, -0.008606475262961264, -0.11103353062667286],
		[1, 0.5600463057872329, -0.3206319565801568]
	]
	let [L_, M_, S_] = mmult(mL_M_S_, [I, Ct, Cp]);
	let L = trc.eotf(L_);
	let M = trc.eotf(M_);
	let S = trc.eotf(S_);
	//let mXYZ = minv(mLMS);	
	let mXYZ = [
		[2.070361704905639, -1.3265905746806468, 0.20668104824694955],
		[0.36499038077791895, 0.6804688205998219, -0.045461672447769885],
		[-0.04950289195894824, -0.04950289195894824, 1.1880694070147577]
	];
	let [X, Y, Z] = mmult(mXYZ, [L, M, S]); //.map(u => Decimal(u).toPrecision(5));

	return [X ,Y, Z];
}

function XYZ_to_ITP(X: number, Y: number, Z: number, trc: ToneResponse = ToneResponse.PQ): number[] {
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
	let [L, M, S] = mmult(mLMS, [X, Y, Z]); //.map(u => Decimal(u).toPrecision(5));
	let L_ = trc.oetf(L);
	let M_ = trc.oetf(M);
	let S_ = trc.oetf(S);

	/*
	let alpha = 1.134464;
	let rotation = [[1, 0, 0],[0, Decimal.cos(alpha), Decimal.sin(alpha).negated()],[0, Decimal.sin(alpha), Decimal.cos(alpha)]];
	let scalar = [[1, 1, 1],[1.4, 1.4, 1.4],[1, 1, 1]];
	let mICtCp = mmult(rotation, mEbner).map((u,i) => u.map((w,j) => Decimal(w).times(scalar[i][j])));
	*/	
	let mICtCp = [
		[0.5, 0.5, 0],
		[1.6137000085069027, -3.323396142928996, 1.7096961344220933],
		[4.3780624470043605, -4.2455397990705706, -0.13252264793378987]
	];
	let [I, Ct, Cp] = mmult(mICtCp, [L_, M_, S_]);
	let T = Decimal(Ct).times(0.5);
	let P = Cp;

	return [I, T, P];
}

export type ColorModelTypeString = typeof ColorModel.types[number];
export type ColorModelType = RGB | rgb | XYZ | xyY | xy | LUV | uv | ITP;
export { XYZ, xy, xyY, RGB, rgb }
export default ColorModel;