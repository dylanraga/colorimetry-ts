/**
 * Björn Ottosson Oklab definitions and conversions
 */
import { minv, mmult3331 as mmult } from '../../common/util.js';
import { LabSpace } from '../lab.js';
import { XYZSPACE_D65_NORMALIZED } from '../xyz/predefined.js';

export const LABSPACE_OKLAB = new LabSpace({
	id: 'oklab',
	name: 'Oklab',
	keys: ['L', 'a', 'b'],
	conversions: [
		{
			space: XYZSPACE_D65_NORMALIZED,
			toFn: Oklab_to_XnYnZn,
			fromFn: XnYnZn_to_Oklab,
		},
	],
	precision: 3,
	convertingProps: {
		rgbBlackLevel: 0,
		rgbWhiteLevel: 1,
	},
});

declare module '../lab' {
	interface LabSpaceNamedMap {
		oklab: typeof LABSPACE_OKLAB;
	}
}

/**
 * XYZ <-> Oklab conversion functions
 */

const M1 = [
	[0.8189330101, 0.3618667424, -0.1288597137],
	[0.0329845436, 0.9293118715, 0.0361456387],
	[0.0482003018, 0.2643662691, 0.633851707],
];
const M1Inv = minv(M1);

const M2 = [
	[0.2104542553, 0.793617785, -0.0040720468],
	[1.9779984951, -2.428592205, 0.4505937099],
	[0.0259040371, 0.7827717662, -0.808675766],
];
const M2Inv = minv(M2);

function XnYnZn_to_Oklab(XnYnZn: number[]) {
	const LMS = mmult(M1, XnYnZn);
	const LpMpSp = LMS.map(Math.cbrt);
	const Lab = mmult(M2, LpMpSp);

	return Lab;
}

function Oklab_to_XnYnZn(Lab: number[]) {
	const LpMpSp = mmult(M2Inv, Lab);
	const LMS = LpMpSp.map((u) => u * u * u);
	const XnYnZn = mmult(M1Inv, LMS);

	return XnYnZn;
}
