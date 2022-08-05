//output is significant to 5 digits, limited by precision of von kries and ebner matrices
//might be worth investigating internally quantizing the conversion to 12 bits RGB (=4095 codewords)
import { minv, mmult3331 as mmult } from "../../common/util";
import { curves } from "../../trc";
import { ToneResponse } from "../../trc";
import { LabSpace } from "../lab";
import { XYZSPACE_D65 } from "../xyz.standard";

export const LABSPACE_JZAZBZ = new LabSpace();
LABSPACE_JZAZBZ.name = 'Jzazbz';
LABSPACE_JZAZBZ.keys = ['Jz', 'az', 'bz'];

LABSPACE_JZAZBZ.addConversion(XYZSPACE_D65,
	//JzAzBz -> XYZ
	(JzAzBz: number[]) => JzAzBz_to_XYZ(JzAzBz),
	//XYZ -> JzAzBz
	(XYZ: number[]) => XYZ_to_JzAzBz(XYZ)
);

LABSPACE_JZAZBZ.register('JZAZBZ');

declare module '../lab' {
	interface LabSpaceNamedMap {
		JZAZBZ: LabSpace;
	}
}


/*
 * JzAzBz <-> XYZ conversions
 */

//constants
const b = 1.15;
const g = 0.66;
const d = -0.56;
const d0 = 1.6295499532821566e-11;

const mXpYpZp_to_LMS = [
	[ 0.41478972, 0.579999, 0.0146480],
	[-0.20151000, 1.120649, 0.0531008],
	[-0.01660080, 0.264800, 0.6684799]
];
const mLMS_to_XpYpZp = minv(mXpYpZp_to_LMS);

const mLMS_to_IAB = [
	[0.500000,  0.500000,  0.000000],
	[3.524000, -4.066708,  0.542708],
	[0.199076,  1.096799, -1.295875]
];
const mIAB_to_LMS = minv(mLMS_to_IAB);

function XYZ_to_JzAzBz([X, Y, Z]: number[], trc: ToneResponse = curves.ST2084.options({m2: 134.034375})): number[] {
	const Xp = b*X - ((b-1)*Z);
	const Yp = g*Y - ((g-1)*X);
	
	let LMS = mmult(mXpYpZp_to_LMS, [Xp, Yp, Z]);
	let LMSp = LMS.map(u => trc.invEotf(u));
	let [Iz, az, bz] = mmult(mLMS_to_IAB, LMSp);

	let Jz = ( ((1+d)*Iz)/(1+d*Iz) ) - d0;

	return [Jz, az, bz];
}

function JzAzBz_to_XYZ([Jz, az, bz]: number[], trc: ToneResponse = curves.ST2084.options({m2: 134.034375})): number[] {
	let Jz_ = Jz + d0;
	let Iz = (Jz_) / (1+d-d*(Jz_));

	let LMSp = mmult(mIAB_to_LMS, [Iz, az, bz]);
	let LMS = LMSp.map(u => trc.eotf(u));
	let [Xp, Yp, Zp] = mmult(mLMS_to_XpYpZp, LMS);

	let X = (1/b) * (Xp + (b-1)*Zp);
	let Y = (1/g) * (Yp + (g-1)*X);

	return [X, Y, Zp];
}