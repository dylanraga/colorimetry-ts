/**
 * Correlated Color Temperature module
 * Warning: This is a slow operation!
 */

import { Color } from "../color";
import { CHROMATICITY_UV } from "../space/chromaticity/uv";

const k = [
	[-1.77348E-01, 1.115559E+00, -1.5008606E+00, 9.750013E-01, -3.307009E-01, 5.6061400E-02, -3.7146000E-03],
	[5.308409E-04, 2.1595434E-03, -4.3534788E-03, 3.6196568E-03, -1.589747E-03, 3.5700160E-04, -3.2325500E-05],
	[-8.58308927E-01, 1.964980251E+00, -1.873907584E+00, 9.53570888E-01, -2.73172022E-01, 4.17781315E-02, -2.6653835E-03],
	[-2.3275027E+02, 1.49284136E+03, -2.7966888E+03, 2.51170136E+03, -1.1785121E+03, 2.7183365E+02, -2.3524950E+01],
	[-5.926850606E+08, 1.34488160614E+09, -1.27141290956E+09, 6.40976356945E+08, -1.81749963507E+08, 2.7482732935E+07, -1.731364909E+06],
	[-2.3758158E+06, 3.89561742E+06, -2.65299138E+06, 9.60532935E+05, -1.9500061E+05, 2.10468274E+04, -9.4353083E+02],
	[2.8151771E+06, -4.11436958E+06, 2.48526954E+06, -7.93406005E+05, 1.4101538E+05, -1.321007E+04, 5.0857956E+02],
];

/**
 * Retrieves Correlated Color Temperature of a Color
 * Performs a binary search for the nearest CIExy coords on the blackbody locus
 * @param color Color to find CCT of
 */
function getCCT(color: Color) {

	const [up, vp] = color.get(CHROMATICITY_UV);
	const [u, v] = [up, 2*vp/3];

	const kix = (i: number, t: number) => (k[i][6]*t**6 + k[i][5]*t**5 + k[i][4]*t**4 + k[i][3]*t**3 + k[i][2]*t*t + k[i][1]*t + k[i][0])


	const L_FP = Math.sqrt( (u-0.292)*(u-0.292) + (v-0.24)*(v-0.24) );
	const a1 = Math.atan((v-0.24)/(u-0.292));
	const a = a1 >= 0 ? a1 : a1 + Math.PI;
	const L_BB = kix(0, a);
	const Duv = L_FP - L_BB;

	const T1 = a < 2.54 ? 1/kix(1, a) : 1/kix(2, a);
	const dTc1 = a < 2.54
		?   kix(3, a) * (L_BB+0.01) / L_FP * Duv/0.01
		: 1/kix(4, a) * (L_BB+0.01) / L_FP * Duv/0.01;

	const T2 = T1-dTc1;
	const c = Math.log10(T2);

	const dTc2 = Duv >= 0 ? kix(5, c) : kix(6, c) * Math.abs(Duv/0.03)*Math.abs(Duv/0.03);
	const cct = T2 - dTc2;

	return +cct.toFixed(0);

}

Object.defineProperty(Color.prototype, "cct", { get: function() { return getCCT(this); } });

declare module '../color' {
	interface Color {
		cct: ReturnType<typeof getCCT>
	}
}
