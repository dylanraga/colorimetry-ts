import ColorGamut from '../../ColorGamut.js';
import ColorModel from '../../ColorModel.js';
import ColorSpace from '../../ColorSpace.js';
import ToneResponse from '../../ToneResponse.js';

const CIELAB = new ColorSpace(ColorModel.types.LAB, [
	{
		space: ColorModel.types.XYZ,
		//XYZ -> CIELAB
		from: (XYZ: number[], o: {gamut?: ColorGamut} = {}) => {
			const { gamut = ColorGamut.SRGB } = o;
			let Lab = XYZ_to_CIELAB(XYZ);
			return Lab;
		},
		//CIELAB -> XYZ
		to: (Lab: number[], o: {gamut?: ColorGamut} = {}) => {
			const { gamut = ColorGamut.SRGB } = o;
			let XYZ = CIELAB_to_XYZ(Lab);
			return XYZ;
		}
	}
]);
CIELAB.name = 'CIELAB';

ColorModel.types.LAB.spaces.CIELAB = CIELAB;
ColorModel.types.LAB.defaultSpace = CIELAB;

/*
 * CIELAB conversion functions.
 * ----------------------------
 * Use illuminant D50 since CIELAB was intended for reflective surfaces, not emissive/transmissive displays.
 * Currently using "wrong" Von Kries/XYZ scaling per spec; might implement manual Bradford CAT option in the future
 */

function XYZ_to_CIELAB([X, Y, Z]: number[], Yn: number = 100, white: {x, y} = {x: 0.34567, y: 0.35850}): number[] {
	let [Xn, Zn] = [white.x*Yn/white.y, (1-white.x-white.y)*Yn/white.y];

	let d = 6/29;
	let f = x => (x > d*d*d)? x**(1/3) : x/(3*d*d) + (4/29);
	//let L = 100 * ToneResponse.LSTAR.oetf(Y);
	let L = 116 * f(Y/Yn) - 16;
	let a = 500 * (f(X/Xn) - f(Y/Yn));
	let b = 200 * (f(Y/Yn) - f(Z/Zn));

	return [L, a, b];
}

function CIELAB_to_XYZ([L, a, b]: number[], Yn: number = 100, white: {x, y} = {x: 0.34567, y: 0.35850}): number[] {
	let [Xn, Zn] = [white.x*Yn/white.y, (1-white.x-white.y)*Yn/white.y];
	
	let d = 6/29
	let f = x => (x > d)? x*x*x : 3*d*d*(x - 4/29);
	let Lp = (L+16) / 116;

	let X = Xn * f(Lp + a/500);
	let Y = Yn * f(Lp);
	let Z = Zn * f(Lp - b/200);

	return [X, Y, Z];
}

export { XYZ_to_CIELAB, CIELAB_to_XYZ };
