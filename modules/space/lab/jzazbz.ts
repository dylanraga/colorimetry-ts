/**
 * JzAzBz definitions and conversions
 * --------------------------------
 */
import { minv, mmult3331 as mmult } from '../../common/util.js';
import { TRC_ST2084 } from '../../trc/st2084.js';
import { LabSpace } from '../lab.js';
import { XYZSPACE_D65 } from '../xyz/predefined.js';

export const LABSPACE_JZAZBZ = new LabSpace({
	id: 'jzazbz',
	name: 'Jzazbz',
	keys: ['Jz', 'az', 'bz'],
	conversions: [
		{
			space: XYZSPACE_D65,
			toFn: JzAzBz_to_XYZ,
			fromFn: XYZ_to_JzAzBz,
		},
	],
	precision: 6,
});

declare module '../lab' {
	interface LabSpaceNamedMap {
		jzazbz: typeof LABSPACE_JZAZBZ;
	}
}

/*
 * JzAzBz <-> XYZ conversions
 */
const b = 1.15;
const g = 0.66;
const d = -0.56;
const d0 = 1.629549953282157e-11;

const mXpYpZp_to_LMS = [
	[0.41478972, 0.579999, 0.014648],
	[-0.20151, 1.120649, 0.0531008],
	[-0.0166008, 0.2648, 0.6684799],
];
const mLMS_to_XpYpZp = minv(mXpYpZp_to_LMS);

const mLMS_to_IAB = [
	[0.5, 0.5, 0.0],
	[3.524, -4.066708, 0.542708],
	[0.199076, 1.096799, -1.295875],
];
const mIAB_to_LMS = minv(mLMS_to_IAB);
const jabTrc = TRC_ST2084.props({ m2: 134.034375 });

function XYZ_to_JzAzBz([X, Y, Z]: number[]): number[] {
	const Xp = b * X - (b - 1) * Z;
	const Yp = g * Y - (g - 1) * X;

	const LMS = mmult(mXpYpZp_to_LMS, [Xp, Yp, Z]);
	const LMSp = LMS.map((u) => jabTrc.invEotf(u));
	const [Iz, az, bz] = mmult(mLMS_to_IAB, LMSp);

	const Jz = ((1 + d) * Iz) / (1 + d * Iz) - d0;

	return [Jz, az, bz];
}

function JzAzBz_to_XYZ([Jz, az, bz]: number[]): number[] {
	const Jz_ = Jz + d0;
	const Iz = Jz_ / (1 + d - d * Jz_);

	const LMSp = mmult(mIAB_to_LMS, [Iz, az, bz]);
	const LMS = LMSp.map((u) => jabTrc.eotf(u));
	const [Xp, Yp, Zp] = mmult(mLMS_to_XpYpZp, LMS);

	const X = (1 / b) * (Xp + (b - 1) * Zp);
	const Y = (1 / g) * (Yp + (g - 1) * X);

	return [X, Y, Zp];
}
