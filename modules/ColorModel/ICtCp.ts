//output is significant to 5 digits, limited by precision of von kries and ebner matrices
//might be worth investigating internally quantizing the conversion to 12 bits RGB (=4095 codewords)
import { mmult, minv } from "../common/util.js";
import Decimal from "../common/decimal.mjs";
import ToneResponse from "../ToneResponse.js";
import ColorModel from "../ColorModel.js";

interface ICtCp {
	I: number;
	Ct: number;
	Cp: number;
}

ColorModel.types.ICtCp = {
	keys: ['I', 'Ct', 'Cp'],
	convertFns: {
		'XYZ': (ICtCp: number[]) => {
			let XYZ = ICtCp_to_XYZ(ICtCp);
			return XYZ;
		},
		'ITP': (ICtCp: number[]) => [ICtCp[0], Decimal(ICtCp[1]).div(2), ICtCp[2]]
	}
}

ColorModel.types.XYZ.convertFns.ICtCp = (XYZ: number[]) => {
	let ICtCp = XYZ_to_ICtCp(XYZ);
	return ICtCp;
};

interface ITP {
	I: number;
	T: number;
	P: number;
}

ColorModel.types.ITP = {
	keys: ['I', 'T', 'P'],
	convertFns: {
		'ICtCp': (ITP: number[]) => [ITP[0], Decimal(ITP[1]).times(2), ITP[2]]
	}
}

const mEbner = [
	[0.5, 0.5, 0],
	[4.4550, -4.8510, 0.3960],
	[0.8056, 0.3572, -1.1628]
];

/*
 * ICtCp/ITP conversions
 */

function ICtCp_to_XYZ(ICtCp: number[], trc: ToneResponse = ToneResponse.PQ): number[] {
	let [I, Ct, Cp] = ICtCp;
	//let mL_M_S_ = minv(mICtCp);
	let mL_M_S_ = [
		[1, 0.008606475262961264, 0.11103353062667286],
		[1, -0.008606475262961264, -0.11103353062667286],
		[1, 0.5600463057872329, -0.3206319565801568]
	]
	let [L_, M_, S_] = mmult(mL_M_S_, [I, Ct, Cp]);
	let L = trc.eotf(L_);
	let M = trc.eotf(M_);
	let S = trc.eotf(S_);
	//let mXYZ = minv(mLMS);	
	let mXYZ = [
		[2.070361704905639, -1.3265905746806468, 0.20668104824694955],
		[0.36499038077791895, 0.6804688205998219, -0.045461672447769885],
		[-0.04950289195894824, -0.04950289195894824, 1.1880694070147577]
	];
	let [X, Y, Z] = mmult(mXYZ, [L, M, S]); //.map(u => Decimal(u).toPrecision(5));

	return [X ,Y, Z];
}

function XYZ_to_ICtCp(XYZ: number[], trc: ToneResponse = ToneResponse.PQ): number[] {
	const [X, Y, Z] = XYZ;
	/*
	let C = 0.04;
	let mCrossTalk = [[1-2*C, C, C], [C, 1-2*C, C], [C, C, 1-2*C]];
	let mLMS = mmult(mCrossTalk, mVonKries);
	*/
	let mLMS = [
		[0.3591688, 0.6976048, -0.0357884],
		[-0.1921864, 1.1003984, 0.0755404],
		[0.0069576, 0.0749168, 0.843358]
	];
	let [L, M, S] = mmult(mLMS, [X, Y, Z]); //.map(u => Decimal(u).toPrecision(5));
	let L_ = trc.oetf(L);
	let M_ = trc.oetf(M);
	let S_ = trc.oetf(S);

	/*
	let alpha = 1.134464;
	let rotation = [[1, 0, 0],[0, Decimal.cos(alpha), Decimal.sin(alpha).negated()],[0, Decimal.sin(alpha), Decimal.cos(alpha)]];
	let scalar = [[1, 1, 1],[1.4, 1.4, 1.4],[1, 1, 1]];
	let mICtCp = mmult(rotation, mEbner).map((u,i) => u.map((w,j) => Decimal(w).times(scalar[i][j])));
	*/	
	let mICtCp = [
		[0.5, 0.5, 0],
		[1.6137000085069027, -3.323396142928996, 1.7096961344220933],
		[4.3780624470043605, -4.2455397990705706, -0.13252264793378987]
	];
	let [I, Ct, Cp] = mmult(mICtCp, [L_, M_, S_]);

	return [I, Ct, Cp];
}

export { ICtCp_to_XYZ, XYZ_to_ICtCp, ITP, ICtCp };