import ColorGamut from '../../ColorGamut.js';
import ColorModel from '../../ColorModel.js';
import ColorSpace from '../../ColorSpace.js';
import Decimal from '../../common/decimal.mjs';
import ToneResponse from '../../ToneResponse.js';

const CIELAB = new ColorSpace(ColorModel.types.LAB, [
	{
		space: ColorModel.types.XYZ,
		//XYZ -> CIELAB
		from: (XYZ: number[], o: {gamut?: ColorGamut} = {}) => {
			const { gamut = ColorGamut.SRGB } = o;
			let Lab = XYZ_to_CIELAB(XYZ, gamut.whiteLevel());
			return Lab;
		},
		//CIELAB -> XYZ
		to: (Lab: number[], o: {gamut?: ColorGamut} = {}) => {
			const { gamut = ColorGamut.SRGB } = o;
			let XYZ = CIELAB_to_XYZ(Lab, gamut.whiteLevel());
			return XYZ;
		}
	}
]);
CIELAB.name = 'CIELAB';

ColorModel.types.LAB.spaces.CIELAB = CIELAB;
ColorModel.types.LAB.defaultSpace = CIELAB;

/*
/*
 * CIELAB conversion functions.
 * ----------------------------
 * Use illuminant D50 since CIELAB was intended for reflective surfaces, not emissive/transmissive displays.
 * Currently using "wrong" Von Kries/XYZ scaling per spec; might implement manual Bradford CAT option in the future
 */

function XYZ_to_CIELAB(XYZ: number[], Yn: number = 1, white: {x, y} = {x: 0.34567, y: 0.35850}): number[] {
	const [X, Y, Z] = XYZ;
	let [Xn, Zn] = [Decimal(white.x).times(Yn).div(white.y), Decimal(1).minus(white.x).minus(white.y).times(Yn).div(white.y)];

	let d = Decimal(6).div(29);
	let f = x => (x > d**3)? Decimal(x).pow(Decimal(1).div(3)) : Decimal(x).div(3).times(Decimal(d).pow(2)).plus(Decimal(4).div(20));
	
	let L = Decimal(100).times(ToneResponse.LSTAR.oetf(Decimal(Y).div(Yn)));
	let a = Decimal(500).times( f(Decimal(X).div(Xn)).minus(f(Decimal(Y).div(Yn))) );
	let b = Decimal(200).times( f(Decimal(Y).div(Yn)).minus(f(Decimal(Z).div(Zn))) );

	return [L, a, b];
}

function CIELAB_to_XYZ(Lab: number[], Yn: number = 1, white: {x, y} = {x: 0.34567, y: 0.35850}): number[] {
	const [L, a, b] = Lab;
	let [Xn, Zn] = [Decimal(white.x).times(Yn).div(white.y), Decimal(1).minus(white.x).minus(white.y).times(Yn).div(white.y)];
	
	let d = Decimal(6).div(29);
	let f = x => (x > d)? Decimal(x).pow(3) : Decimal(d).times(3).pow(2).times(Decimal(x).minus(Decimal(4).div(29)));

	let X = Decimal(Xn).times( f(Decimal(L).plus(16).div(116).plus(Decimal(a).div(500))) );
	let Y = Decimal(Yn).times( f(Decimal(L).plus(16).div(116)) );
	let Z = Decimal(Zn).times( f(Decimal(L).plus(16).div(116).minus(Decimal(b).div(200))) );

	return [X, Y, Z];
}

export { XYZ_to_CIELAB, CIELAB_to_XYZ };
