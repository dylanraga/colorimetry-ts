import ColorGamut from "../../ColorGamut.js";
import ToneResponse from "../../ToneResponse.js";
import ColorModel from "../../ColorModel.js";
import ColorSpace from "../../ColorSpace.js";

/* CIELUV */
const CIELUV = new ColorSpace(ColorModel.types.LAB, [
	{
		space: ColorModel.types.XYZ,
		//XYZ -> CIELUV
		from: (XYZ: number[], o: {gamut?: ColorGamut} = {}) => {
			const { gamut = ColorGamut.SRGB } = o;
			let LUV = XYZ_to_LUV(XYZ);
			return LUV;
		},
		//CIELUV -> XYZ
		to: (LUV: number[], o: {gamut?: ColorGamut} = {}) => {
			const { gamut = ColorGamut.SRGB } = o;
			let XYZ = LUV_to_XYZ(LUV);
			return XYZ;
		}
	}
]);
CIELUV.name = 'CIELUV';
CIELUV.alias.push('LUV', 'Luv');
ColorModel.types.LAB.spaces.CIELUV = CIELUV;


/* CIEuv */
const CIEuv = new ColorSpace(ColorModel.types.LAB, [
	{
		space: ColorModel.types.XYZ,
		//XYZ -> CIEuv
		from: (XYZ: number[]) => {
			let uv = XYZ_to_uv(XYZ);
			return uv
		}
	},
	{
		space: ColorModel.types.LAB.spaces.CIExy,
		//CIExy -> CIEuv
		from: (xy: number[]) => {
			let uv = xy_to_uv(xy);
			return uv;
		},
		//CIEuv -> CIExy
		to: (uv: number[]) => {
			let xy = uv_to_xy(uv);
			return xy;
		}
	}
]);
CIEuv.name = 'CIEuv';
CIEuv.alias.push('uv');
ColorModel.types.LAB.spaces.CIEuv = CIEuv;

/*
 * CIELUV/u'v' conversions
 */

function XYZ_to_uv([X, Y, Z]: number[]): number[] {
	let [u, v] = [
		4*X / (X + 15*Y + 3*Z),
		9*Y / (X + 15*Y + 3*Z)
	];
	return [u, v];
}

function xy_to_uv([x, y]: number[]): number[] {
	let [u, v] = [
		4*x / (-2*x + 12*y + 3),
		9*y / (-2*x + 12*y + 3)
	];
	return [u, v];
}

function uv_to_xy([u, v]: number[]): number[] {
	let [x, y] = [
		9*u / (6*u - 16*v + 12),
		4*v / (6*u - 16*v + 12)
	];
	return [x, y];
}

function XYZ_to_LUV([X, Y, Z]: number[], Yn: number = 100, white: {x, y} = ColorGamut.SRGB.white): number[] {
	let [u, v] = XYZ_to_uv([X, Y, Z]);
	let [un, vn] = xy_to_uv([white.x, white.y]);
	let L = 100 * ToneResponse.LSTAR.oetf(Y, {Yn});
	let U = 13*L * (u-un);
	let V = 13*L * (v-vn);

	return [L, U, V];
}

function LUV_to_XYZ([L, U, V]: number[], Yn: number = 100, white: {x, y} = ColorGamut.SRGB.white): number[] {
	let Y = ToneResponse.LSTAR.eotf(L/100);
	let [un, vn] = xy_to_uv([white.x, white.y]);
	let u = U/(13*L) + un;
	let v = V/(13*L) + vn;
	let X = Y * (9*u) / (4*v);
	let Z = Y * (12 - 3*u - 20*v) / (4*v);

	return [X, Y, Z];
}

export { LUV_to_XYZ, XYZ_to_LUV, uv_to_xy, xy_to_uv, XYZ_to_uv };