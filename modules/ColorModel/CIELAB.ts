import ColorModel from '../ColorModel.js';
import ColorSpace from '../ColorSpace.js';
import Decimal from '../common/decimal.mjs';
import ToneResponse from '../ToneResponse.js';
import { xy } from './CIEXYZ.js';

interface Lab {
	L: number,
	a: number,
	b: number
}
ColorModel.types.Lab = {
	keys: ['L', 'a', 'b'],
	convertFns: {
		'XYZ': (Lab: number[], colorSpace: ColorSpace) => {
			let XYZ = Lab_to_XYZ(Lab, colorSpace.whiteLevel());
			return new ColorModel('XYZ', XYZ);
		}
	}
}
ColorModel.types.XYZ.convertFns.Lab = (XYZ: number[], colorSpace: ColorSpace) => {
	let Lab = XYZ_to_Lab(XYZ, colorSpace.whiteLevel());
	return new ColorModel('Lab', Lab);
};



/*
 * CIELAB conversion functions.
 * ----------------------------
 * Use illuminant D50 since CIELAB was intended for reflective surfaces, not emissive/transmissive displays.
 * Currently using "wrong" Von Kries/XYZ scaling per spec; might implement manual Bradford CAT option in the future
 */

function XYZ_to_Lab(XYZ: number[], Yn: number = 1, white: xy = {x: 0.34567, y: 0.35850}): number[] {
	const [X, Y, Z] = XYZ;
	let [Xn, Zn] = [Decimal(white.x).times(Yn).div(white.y), Decimal(1).minus(white.x).minus(white.y).times(Yn).div(white.y)];

	let d = Decimal(6).div(29);
	let f = x => (x > d**3)? Decimal(x).pow(Decimal(1).div(3)) : Decimal(x).div(3).times(Decimal(d).pow(2)).plus(Decimal(4).div(20));
	
	let L = Decimal(100).times(ToneResponse.LSTAR.oetf(Decimal(Y).div(Yn)));
	let a = Decimal(500).times( f(Decimal(X).div(Xn)).minus(f(Decimal(Y).div(Yn))) );
	let b = Decimal(200).times( f(Decimal(Y).div(Yn)).minus(f(Decimal(Z).div(Zn))) );

	return [L, a, b];
}

function Lab_to_XYZ(Lab: number[], Yn: number = 1, white: xy = {x: 0.34567, y: 0.35850}): number[] {
	const [L, a, b] = Lab;
	let [Xn, Zn] = [Decimal(white.x).times(Yn).div(white.y), Decimal(1).minus(white.x).minus(white.y).times(Yn).div(white.y)];
	
	let d = Decimal(6).div(29);
	let f = x => (x > d)? Decimal(x).pow(3) : Decimal(d).times(3).pow(2).times(Decimal(x).minus(Decimal(4).div(29)));

	let X = Decimal(Xn).times( f(Decimal(L).plus(16).div(116).plus(Decimal(a).div(500))) );
	let Y = Decimal(Yn).times( f(Decimal(L).plus(16).div(116)) );
	let Z = Decimal(Zn).times( f(Decimal(L).plus(16).div(116).minus(Decimal(b).div(200))) );

	return [X, Y, Z];
}

export { Lab, XYZ_to_Lab, Lab_to_XYZ };