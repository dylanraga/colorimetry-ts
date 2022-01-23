import Decimal from "../common/decimal.mjs";
import ToneResponse from "../ToneResponse.js";
import ColorGamut from "../ColorGamut.js";
import { xy } from "./CIEXYZ.js";
import ColorModel from "../ColorModel.js";
import ColorSpace from "../ColorSpace.js";

interface LUV {
	L: number;
	U: number;
	V: number;
}

ColorModel.types.LUV = {
	keys: ['L', 'U', 'V'],
	convertFns: {
		'XYZ': (LUV: number[], colorSpace: ColorSpace) => {
			let XYZ = LUV_to_XYZ(LUV, colorSpace.whiteLevel());
			return XYZ;
		}
	}
};
ColorModel.types.XYZ.convertFns.LUV = (XYZ: number[], colorSpace: ColorSpace) => {
	let LUV = XYZ_to_LUV(XYZ, colorSpace.whiteLevel());
	return LUV;
}


interface uv {
	u: number;
	v: number;
}

ColorModel.types.uv = {
	keys: ['u', 'v'],
	convertFns: {
		'xy': (uv: number[]) => {
			let xy = uv_to_xy(uv);
			return xy;
		}
	}
}

ColorModel.types.XYZ.convertFns.uv = (XYZ: number[]) => {
	let uv = XYZ_to_uv(XYZ);
	return uv;
};

ColorModel.types.xy.convertFns.uv = (xy: number[]) => {
	let uv = xy_to_uv(xy);
	return uv;
};

/*
 * CIELUV/u'v' conversions
 */

function XYZ_to_uv(XYZ: number[]): number[] {
	const [X, Y, Z] = XYZ;
	let [u, v] = [Decimal(X).times(4).div(Decimal(X).plus(Decimal(Y).times(15)).plus(Decimal(Z).times(3))), Decimal(Y).times(9).div(Decimal(X).plus(Decimal(Y).times(15)).plus(Decimal(Z).times(3)))];
	return [u, v];
}

function xy_to_uv(xy: number[]): number[] {
	const [x, y] = xy;
	let [u, v] = [Decimal(x).times(4).div(Decimal(x).times(-2).plus(Decimal(y).times(12)).plus(3)), Decimal(y).times(9).div(Decimal(x).times(-2).plus(Decimal(y).times(12)).plus(3))];
	return [u, v];
}

function uv_to_xy(uv: number[]): number[] {
	const [u, v] = uv;
	let [x, y] = [Decimal(u).times(9).div( Decimal(u).times(6).minus( Decimal(v).times(16) ).plus(12) ), Decimal(v).times(4).div( Decimal(u).times(6).minus( Decimal(v).times(16) ).plus(12) )];
	return [x, y];
}

function XYZ_to_LUV(XYZ: number[], Yn: number = 1, white: xy = ColorGamut.SRGB.white): number[] {
	const [X, Y, Z] = XYZ;
	let [u, v] = XYZ_to_uv(XYZ);
	let [un, vn] = xy_to_uv([white.x, white.y]);
	let L = Decimal(100).times(ToneResponse.LSTAR.oetf(Y/Yn));
	let U = Decimal(L).times(13).times(Decimal(u).minus(un));
	let V = Decimal(L).times(13).times(Decimal(v).minus(vn));

	return [L, U, V];
}

function LUV_to_XYZ(LUV: number[], Yn: number = 1, white: xy = ColorGamut.SRGB.white): number[] {
	const [L, U, V] = LUV;
	let Y = Decimal(Yn).times(ToneResponse.LSTAR.eotf(Decimal(L).div(100)));
	let [un, vn] = xy_to_uv([white.x, white.y]);
	let u = Decimal(U).div(Decimal(L).times(13)).plus(un);
	let v = Decimal(V).div(Decimal(L).times(13)).plus(vn);
	let X = Decimal(Y).times( Decimal(u).times(9).div( Decimal(v).times(4) ) );
	let Z = Decimal(Y).times( Decimal(12).minus( Decimal(u).times(3) ).minus( Decimal(v).times(20) ).div( Decimal(v).times(4) ) );

	return [X, Y, Z];
}

export { LUV, uv, LUV_to_XYZ, XYZ_to_LUV, uv_to_xy, xy_to_uv, XYZ_to_uv}