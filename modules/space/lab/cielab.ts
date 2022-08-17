/**
 * CIELAB definitions and conversions
 * ----------------------------
 * Use illuminant D50 since CIELAB was intended for reflective surfaces, not emissive/transmissive displays.
 * Currently using "wrong" Von Kries/XYZ scaling per spec; consider implementing manual Bradford CAT option in the future
 */
import { ILLUMINANT_D50 } from '../../illuminants/predefined.js';
import { TRC_LSTAR } from '../../trc/lstar.js';
import { LabSpace } from '../lab.js';
import { XYZSPACE_D65_NORMALIZED } from '../xyz/predefined.js';

export const LABSPACE_CIELAB = new LabSpace({
	id: 'lab',
	name: 'CIELab 1931',
	keys: ['L', 'a', 'b'],
	conversions: [
		{
			space: XYZSPACE_D65_NORMALIZED.cat(ILLUMINANT_D50, 'xyz'),
			toFn: CIELab_to_XnYnZn,
			fromFn: XnYnZn_to_CIELab,
		},
	],
	convertingProps: {
		rgbWhiteLuminance: 100,
		rgbBlackLuminance: 0,
	},
});

declare module '../lab' {
	interface LabSpaceNamedMap {
		lab: typeof LABSPACE_CIELAB;
	}
}

/**
 * CIELAB <-> XYZ conversion functions
 */
export function XnYnZn_to_CIELab([Xn, Yn, Zn]: number[]) {
	const f = (x: number) => (100 * TRC_LSTAR.invEotf(x) + 16) / 116;
	const L = 116 * f(Yn) - 16;
	const a = 500 * (f(Xn) - f(Yn));
	const b = 200 * (f(Yn) - f(Zn));

	return [L, a, b];
}

export function CIELab_to_XnYnZn([L, a, b]: number[]) {
	const fInv = (x: number) => TRC_LSTAR.eotf((116 * x - 16) / 100);
	const Lp = (L + 16) / 116;
	const Xn = fInv(Lp + a / 500);
	const Yn = fInv(Lp);
	const Zn = fInv(Lp - b / 200);

	return [Xn, Yn, Zn];
}
