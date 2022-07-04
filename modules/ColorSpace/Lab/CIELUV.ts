import { illuminants } from "../../Illuminants/Illuminants.js";
import { curves } from "../../ToneResponse/StandardToneResponses.js";
import { XYZSpace } from "../XYZ/XYZSpace.js";
import { LabSpace } from "./LabSpace.js";

interface xy { x: number, y: number }

/* CIELUV */
const LABSPACE_CIELUV = new LabSpace(['L', 'U', 'V']);
LABSPACE_CIELUV.addConversion(XYZSpace.defaultSpace,
	//CIELUV -> XYZ
	(LUV: number[], o: { whiteY?: number, white?: xy } = {}) => {
		const { whiteY, white } = o;
		let XYZ = LUV_to_XYZ(LUV, whiteY, white);
		return XYZ;
	},
	//XYZ -> CIELUV
	(XYZ: number[], o: { whiteY?: number, white?: xy} = {}) => {
		const { whiteY, white } = o;
		let LUV = XYZ_to_LUV(XYZ, whiteY, white);
		return LUV;
	});
LABSPACE_CIELUV.name = 'CIELUV';


/* CIEuv 
const CIEuv = new ColorSpace([
	{
		space: XYZSpace.defaultSpace,
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
*/

/*
 * CIELUV/u'v' conversions
 */

function XYZ_to_uv([X, Y, Z]: number[]): number[] {
	const denom = (X + 15*Y + 3*Z);
	return [4*X / denom, 9*Y / denom];
}

function xy_to_uv([x, y]: number[]): number[] {
	const denom = (-2*x + 12*y + 3);
	return [4*x / denom, 9*y / denom];
}

function uv_to_xy([u, v]: number[]): number[] {
	const denom = (6*u - 16*v + 12);
	return [9*u / denom, 4*v / denom];
}

function XYZ_to_LUV([X, Y, Z]: number[], whiteY: number = 100, white: xy = illuminants.D65): number[] {
	let [u, v] = XYZ_to_uv([X, Y, Z]);
	let [un, vn] = xy_to_uv([white.x, white.y]);
	let L = 100 * curves.LSTAR.invEotf(Y, { whiteY });
	let U = 13*L * (u-un);
	let V = 13*L * (v-vn);

	return [L, U, V];
}

function LUV_to_XYZ([L, U, V]: number[], whiteY: number = 100, white: xy = illuminants.D65): number[] {
	let Y = curves.LSTAR.eotf(L/100);
	let [un, vn] = xy_to_uv([white.x, white.y]);
	let u = U/(13*L) + un;
	let v = V/(13*L) + vn;
	let X = Y * (9*u) / (4*v);
	let Z = Y * (12 - 3*u - 20*v) / (4*v);

	return [X, Y, Z];
}

export { LUV_to_XYZ, XYZ_to_LUV, uv_to_xy, xy_to_uv, XYZ_to_uv };