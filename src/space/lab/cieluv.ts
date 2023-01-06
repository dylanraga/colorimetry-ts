/**
 * CIELuv definitions and conversions
 */
import { ILLUMINANT_D65 } from '../../illuminants/predefined.js';
import { TRC_LSTAR } from '../../trc/lstar.js';
import { uv_to_XnYnZn, XYZ_to_uv, xy_to_uv } from '../chromaticity/uv.js';
import { LabSpace } from '../lab.js';
import { XYZSPACE_D65_NORMALIZED } from '../xyz/predefined.js';

export const LABSPACE_CIELUV = new LabSpace({
	id: 'luv',
	name: 'CIELuv 1976',
	keys: ['L', 'u', 'v'],
	conversions: [
		{
			space: XYZSPACE_D65_NORMALIZED,
			toFn: CIELuv_to_XnYnZn,
			fromFn: XnYnZn_to_CIELuv,
		},
	],
	convertingProps: {
		rgbWhiteLuminance: 100,
		rgbBlackLuminance: 0,
	},
});

declare module '../lab' {
	interface LabSpaceNamedMap {
		luv: typeof LABSPACE_CIELUV;
	}
}

/*
 * CIELUV/u'v' <-> XYZ conversions
 */
const CIELUV_REFERENCE_ILLUMINANT = ILLUMINANT_D65;
const [ur, vr] = xy_to_uv([CIELUV_REFERENCE_ILLUMINANT.x, CIELUV_REFERENCE_ILLUMINANT.y]);

export function XnYnZn_to_CIELuv(XnYnZn: number[]) {
	const [u, v] = XYZ_to_uv(XnYnZn);
	const L = 100 * TRC_LSTAR.invEotf(XnYnZn[1]);
	const U = 13 * L * (u - ur);
	const V = 13 * L * (v - vr);

	return [L, U, V];
}

export function CIELuv_to_XnYnZn([L, U, V]: number[]) {
	const u = U / (13 * L) + ur;
	const v = V / (13 * L) + vr;
	const Yn = TRC_LSTAR.eotf(L / 100);
	const [Xn, , Zn] = uv_to_XnYnZn([u, v], { refWhiteLuminance: Yn });

	return [Xn, Yn, Zn];
}
