import { illuminants } from "../../illuminants";
import { ColorSpace } from "../../space";
import { curves } from "../../trc.standard";
import { uv_to_XYZ, XYZ_to_uv, xy_to_uv } from "../chromaticity/uv";
import { LabSpace } from "../lab";
import { XYZSPACE_CIED65 } from "../xyz.standard";

interface xy { x: number, y: number }

/* CIELUV */
export const LABSPACE_CIELUV = new LabSpace();
LABSPACE_CIELUV.addConversion(XYZSPACE_CIED65,
	//CIELUV -> XYZ
	(LUV: number[], o: { whiteLevel?: number, white?: xy } = {}) => {
		const { whiteLevel, white } = o;
		let XYZ = LUV_to_XYZ(LUV, whiteLevel, white);
		return XYZ;
	},
	//XYZ -> CIELUV
	(XYZ: number[], o: { whiteLevel?: number, white?: xy} = {}) => {
		const { whiteLevel, white } = o;
		let LUV = XYZ_to_LUV(XYZ, whiteLevel, white);
		return LUV;
	});
LABSPACE_CIELUV.name = 'CIELUV';
LABSPACE_CIELUV.keys = ['L', 'U', 'V'];
ColorSpace.list['CIELUV'] = LABSPACE_CIELUV;
ColorSpace.list['LUV'] = LABSPACE_CIELUV;


/*
 * CIELUV/u'v' conversions
 */

function XYZ_to_LUV([X, Y, Z]: number[], whiteLevel: number = 100, white: xy = illuminants.D65): number[] {
	let [u, v] = XYZ_to_uv([X, Y, Z]);
	let [un, vn] = xy_to_uv([white.x, white.y]);
	let L = 100 * curves.LSTAR.invEotf(Y, { whiteLevel });
	let U = 13*L * (u-un);
	let V = 13*L * (v-vn);

	return [L, U, V];
}

function LUV_to_XYZ([L, U, V]: number[], whiteLevel: number = 100, white: xy = illuminants.D65): number[] {
	let Y = curves.LSTAR.eotf(L/100);
	let [un, vn] = xy_to_uv([white.x, white.y]);
	let u = U/(13*L) + un;
	let v = V/(13*L) + vn;
	let [X,, Z] = uv_to_XYZ([u, v], { whiteLevel: Y });

	return [X, Y, Z];
}

export { LUV_to_XYZ, XYZ_to_LUV };