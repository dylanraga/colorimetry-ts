/**
 * Dolby ICtCp/ITP definitions and conversions
 * -------------------------------------------
 * Output is significant to 5 digits, limited by precision of von kries and ebner matrices
 */
import { minv, mmult3331 as mmult } from '../../common/util.js';
import { TRC_ST2084 } from '../../trc/st2084.js';
import { LabSpace } from '../lab.js';
import { XYZSPACE_D65 } from '../xyz/predefined.js';

export const LABSPACE_ICTCP = new LabSpace({
	id: 'ictcp',
	name: 'ICtCp',
	keys: ['I', 'Ct', 'Cp'],
	conversions: [
		{
			space: XYZSPACE_D65,
			toFn: ICtCp_to_XYZ,
			fromFn: XYZ_to_ICtCp,
		},
	],
	precision: 5,
});

export const LABSPACE_ITP = new LabSpace({
	id: 'itp',
	name: 'ITP (ICtCp)',
	keys: ['I', 'T', 'P'],
	conversions: [
		{
			space: LABSPACE_ICTCP,
			toFn: ([I, T, P]: number[]) => [I, T * 2, P],
			fromFn: ([I, Ct, Cp]: number[]) => [I, Ct / 2, Cp],
		},
	],
	precision: 5,
});

declare module '../lab' {
	interface LabSpaceNamedMap {
		ictcp: typeof LABSPACE_ICTCP;
		itp: typeof LABSPACE_ITP;
	}
}

/*
const mEbner = [
	[0.5, 0.5, 0],
	[4.4550, -4.8510, 0.3960],
	[0.8056, 0.3572, -1.1628]
];
*/
/*
 * ICtCp/ITP <-XYZ> conversions
 */

/*
let C = 0.04;
let mCrossTalk = [[1-2*C, C, C], [C, 1-2*C, C], [C, C, 1-2*C]];
let mXYZ_to_LMS = mmult(mCrossTalk, mVonKries);
*/
const mXYZ_to_LMS = [
	[0.3591688, 0.6976048, -0.0357884],
	[-0.1921864, 1.1003984, 0.0755404],
	[0.0069576, 0.0749168, 0.843358],
];
const mLMS_to_XYZ = minv(mXYZ_to_LMS);

/*
let alpha = 1.134464;
let mRotation = [[1, 0, 0],[0, Math.cos(alpha), -Math.sin(alpha)],[0, Math.sin(alpha), Math.cos(alpha)]];
let scalar = [[1, 1, 1],[1.4, 1.4, 1.4],[1, 1, 1]];
let mLMS_to_ICtCp = mmult(mRotation, mEbner).map((u,i) => u.map((w,j) => w*scalar[i][j]));
*/
const mLMS_to_ICtCp = [
	[0.5, 0.5, 0],
	[1.6137000085069027, -3.323396142928996, 1.7096961344220933],
	[4.3780624470043605, -4.2455397990705706, -0.13252264793378987],
];
const mICtCp_to_LMS = minv(mLMS_to_ICtCp);

function XYZ_to_ICtCp(XYZ: number[]): number[] {
	const LMS = mmult(mXYZ_to_LMS, XYZ);
	const LMSp = LMS.map((u) => TRC_ST2084.invEotf(u));
	const ICtCp = mmult(mLMS_to_ICtCp, LMSp);

	return ICtCp;
}

function ICtCp_to_XYZ(ICtCp: number[]): number[] {
	const LMSp = mmult(mICtCp_to_LMS, ICtCp);
	const LMS = LMSp.map((u) => TRC_ST2084.eotf(u));
	const XYZ = mmult(mLMS_to_XYZ, LMS);

	return XYZ;
}
