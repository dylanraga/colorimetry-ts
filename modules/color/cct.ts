/**
 * Correlated Color Temperature module
 */

import { Color } from '../color.js';
import { CHROMATICITY_UV } from '../space/chromaticity/uv.js';

const k = [
	[-1.77348e-1, 1.115559, -1.5008606, 9.750013e-1, -3.307009e-1, 5.60614e-2, -3.7146e-3],
	[5.308409e-4, 2.1595434e-3, -4.3534788e-3, 3.6196568e-3, -1.589747e-3, 3.570016e-4, -3.23255e-5],
	[-8.58308927e-1, 1.964980251, -1.873907584, 9.53570888e-1, -2.73172022e-1, 4.17781315e-2, -2.6653835e-3],
	[-2.3275027e2, 1.49284136e3, -2.7966888e3, 2.51170136e3, -1.1785121e3, 2.7183365e2, -2.352495e1],
	[
		-5.926850606e8, 1.34488160614e9, -1.27141290956e9, 6.40976356945e8, -1.81749963507e8, 2.7482732935e7,
		-1.731364909e6,
	],
	[-2.3758158e6, 3.89561742e6, -2.65299138e6, 9.60532935e5, -1.9500061e5, 2.10468274e4, -9.4353083e2],
	[2.8151771e6, -4.11436958e6, 2.48526954e6, -7.93406005e5, 1.4101538e5, -1.321007e4, 5.0857956e2],
];

/**
 * Calculates the Correlated Color Temperature of a Color in Kelvins
 * Source: https://cormusa.org/wp-content/uploads/2018/04/CORM_2011_Calculation_of_CCT_and_Duv_and_Practical_Conversion_Formulae.pdf
 * @param color Color to find CCT of
 */
function getCCT(color: Color) {
	const [up, vp] = color.get(CHROMATICITY_UV);
	const [u, v] = [up, (2 * vp) / 3];

	const kix = (i: number, t: number) =>
		k[i][6] * t ** 6 + k[i][5] * t ** 5 + k[i][4] * t ** 4 + k[i][3] * t ** 3 + k[i][2] * t * t + k[i][1] * t + k[i][0];

	const L_FP = Math.sqrt((u - 0.292) * (u - 0.292) + (v - 0.24) * (v - 0.24));
	const a1 = Math.atan((v - 0.24) / (u - 0.292));
	const a = a1 >= 0 ? a1 : a1 + Math.PI;
	const L_BB = kix(0, a);
	const Duv = L_FP - L_BB;

	const T1 = a < 2.54 ? 1 / kix(1, a) : 1 / kix(2, a);
	const dTc1 =
		a < 2.54
			? (((kix(3, a) * (L_BB + 0.01)) / L_FP) * Duv) / 0.01
			: ((((1 / kix(4, a)) * (L_BB + 0.01)) / L_FP) * Duv) / 0.01;

	const T2 = T1 - dTc1;
	const c = Math.log10(T2);

	const dTc2 = Duv >= 0 ? kix(5, c) : kix(6, c) * Math.abs(Duv / 0.03) * Math.abs(Duv / 0.03);
	const cct = T2 - dTc2;

	return +cct.toFixed(0);
}

function _getCCT(this: Color) {
	return getCCT(this);
}

declare module '../color' {
	interface Color {
		readonly cct: ReturnType<typeof _getCCT>;
	}
}

Object.defineProperty(Color.prototype, 'cct', { get: _getCCT });
