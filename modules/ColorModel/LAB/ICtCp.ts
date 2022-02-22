//output is significant to 5 digits, limited by precision of von kries and ebner matrices
//might be worth investigating internally quantizing the conversion to 12 bits RGB (=4095 codewords)
import { minv, mmult } from "../../common/util.js";
import Decimal from "../../common/decimal.mjs";
import ToneResponse from "../../ToneResponse.js";
import ColorModel from "../../ColorModel.js";
import ColorSpace from "../../ColorSpace.js";

const ICtCp = new ColorSpace(ColorModel.types.LAB, [
	{
		space: ColorModel.types.XYZ,
		//XYZ -> ICtCp
		from: (XYZ: number[]) => {
			let ICtCp = XYZ_to_ICtCp(XYZ);
			return ICtCp;
		},
		//ICtCp -> XYZ
		to: (ICtCp: number[]) => {
			let XYZ = ICtCp_to_XYZ(ICtCp);
			return XYZ;
		}
	}
]);
ICtCp.name = 'ICtCp';
ICtCp.keys = ['I', 'Ct', 'Cp'];
ColorModel.types.LAB.spaces.ICtCp = ICtCp;

const ITP = new ColorSpace(ColorModel.types.LAB, [
	{
		space: ICtCp,
		//ICtCp -> ITP
		from: (ICtCp: number[]) => [ICtCp[0], ICtCp[1]/2, ICtCp[2]],
		//ITP -> ICtCp
		to: (ITP: number[]) => [ITP[0], ITP[1]*2, ITP[2]]
	}
]);
ITP.name = 'ITP',
ITP.keys = ['I', 'T', 'P'];
ColorModel.types.LAB.spaces.ITP = ITP;

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
 * ICtCp/ITP conversions
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

function ICtCp_to_XYZ(ICtCp: number[], trc: ToneResponse = ToneResponse.PQ): number[] {
	let [I, Ct, Cp] = ICtCp;

	let [L_, M_, S_] = mmult(mICtCp_to_LMS, [I, Ct, Cp]);
	let L = trc.eotf(L_);
	let M = trc.eotf(M_);
	let S = trc.eotf(S_);

	let [X, Y, Z] = mmult(mLMS_to_XYZ, [L, M, S]); //.map(u => Decimal(u).toPrecision(5));

	return [X ,Y, Z];
}

function XYZ_to_ICtCp(XYZ: number[], trc: ToneResponse = ToneResponse.PQ): number[] {
	const [X, Y, Z] = XYZ;

	let [L, M, S] = mmult(mXYZ_to_LMS, [X, Y, Z]); //.map(u => Decimal(u).toPrecision(5));
	let L_ = trc.oetf(L);
	let M_ = trc.oetf(M);
	let S_ = trc.oetf(S);

	let [I, Ct, Cp] = mmult(mLMS_to_ICtCp, [L_, M_, S_]);

	return [I, Ct, Cp];
}