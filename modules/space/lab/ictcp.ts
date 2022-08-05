//output is significant to 5 digits, limited by precision of von kries and ebner matrices
//might be worth investigating internally quantizing the conversion to 12 bits RGB (=4095 codewords)
import { minv, mmult3331 as mmult } from "../../common/util";
import { curves } from "../../trc";
import { ToneResponse } from "../../trc";
import { LabSpace } from "../lab";
import { XYZSPACE_D65 } from "../xyz.standard";

export const LABSPACE_ICTCP = new LabSpace();
LABSPACE_ICTCP.name = 'ICtCp';
LABSPACE_ICTCP.keys = ['I', 'Ct', 'Cp'];

LABSPACE_ICTCP.addConversion(XYZSPACE_D65,
	//ICtCp -> XYZ
	(ICtCp: number[]) => ICtCp_to_XYZ(ICtCp),
	//XYZ -> ICtCp
	(XYZ: number[]) => XYZ_to_ICtCp(XYZ)
);

LABSPACE_ICTCP.register('ICTCP');

export const LABSPACE_ITP = new LabSpace();
LABSPACE_ITP.name = 'ITP',
LABSPACE_ITP.keys = ['I', 'T', 'P'],

LABSPACE_ITP.addConversion(LABSPACE_ICTCP,
	//ITP -> ICtCp
	([I, T, P]: number[]) => [I, T*2, P],
	//ICtCp -> ITP
	([I, Ct, Cp]: number[]) => [I, Ct/2, Cp]
);

LABSPACE_ITP.register('ITP');

declare module '../lab' {
	interface LabSpaceNamedMap {
		ICTCP: LabSpace;
		ITP: LabSpace;
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
const mVonKries = [
	[0.400240, 0.7076000, -0.0808100],
	[-0.2263000, 1.1653200, 0.0457000],
	[0.0000000, 0.0000000, 0.9182200]
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
	[0.0069576, 0.0749168, 0.843358]
];
const mLMS_to_XYZ = minv(mXYZ_to_LMS);

/*
let alpha = 1.134464;
let rotation = [[1, 0, 0],[0, Decimal.cos(alpha), Decimal.sin(alpha).negated()],[0, Decimal.sin(alpha), Decimal.cos(alpha)]];
let scalar = [[1, 1, 1],[1.4, 1.4, 1.4],[1, 1, 1]];
let mLMS_to_ICtCp = mmult(rotation, mEbner).map((u,i) => u.map((w,j) => Decimal(w).times(scalar[i][j])));
*/
const mLMS_to_ICtCp = [
	[0.5, 0.5, 0],
	[1.6137000085069027, -3.323396142928996, 1.7096961344220933],
	[4.3780624470043605, -4.2455397990705706, -0.13252264793378987]
];
const mICtCp_to_LMS = minv(mLMS_to_ICtCp);

function XYZ_to_ICtCp(XYZ: number[], trc: ToneResponse = curves.ST2084): number[] {
	const LMS = mmult(mXYZ_to_LMS, XYZ); //.map(u => Decimal(u).toPrecision(5));
	const LMSp = LMS.map(u => trc.invEotf(u));

	const ICtCp = mmult(mLMS_to_ICtCp, LMSp);

	return ICtCp;
}

function ICtCp_to_XYZ(ICtCp: number[], trc: ToneResponse = curves.ST2084): number[] {
	const LMSp = mmult(mICtCp_to_LMS, ICtCp);
	const LMS = LMSp.map(u => trc.eotf(u));

	const XYZ = mmult(mLMS_to_XYZ, LMS); //.map(u => Decimal(u).toPrecision(5));

	return XYZ;
}
