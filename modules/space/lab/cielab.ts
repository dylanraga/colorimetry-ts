/**
 * CIELAB conversion functions.
 * ----------------------------
 * Use illuminant D50 since CIELAB was intended for reflective surfaces, not emissive/transmissive displays.
 * Currently using "wrong" Von Kries/XYZ scaling per spec; consider implementing manual Bradford CAT option in the future
 */

import { LabSpace } from '../lab';
import { illuminants } from '../../illuminants';
import { XYZSPACE_D65 } from '../xyz.standard';

interface xy { x: number, y: number }

const LABSPACE_CIELAB = new LabSpace();
LABSPACE_CIELAB.name = 'CIELab';
LABSPACE_CIELAB.keys = ['L', 'a', 'b'];

LABSPACE_CIELAB.addConversion<{ whiteLevel: number, white: xy }>(XYZSPACE_D65,
	(Lab: number[], { white, whiteLevel }) => {
		let XYZ = CIELAB_to_XYZ(Lab, { whiteLevel, white });
		return XYZ;
	},
	(XYZ: number[], { white, whiteLevel }) => {
		let Lab = XYZ_to_CIELAB(XYZ, { whiteLevel, white });
		return Lab;
	}
);
LABSPACE_CIELAB.register('LAB');

declare module '../lab' {
	interface LabSpaceNamedMap {
		LAB: LabSpace;
	}
}

/**
 * CIELAB <-> XYZ conversion functions
 */
const ϵ = 216/24389;
const κ = 24389/27;

function XYZ_to_CIELAB([X, Y, Z]: number[], { whiteLevel = 100, white = illuminants.D50 }: { whiteLevel: number, white: xy}): number[] {
	let [Xn, Zn] = [white.x*whiteLevel/white.y, (1-white.x-white.y)*whiteLevel/white.y];
	let d = 6/29;
	let f = (x: number) => (x > d*d*d)? x**(1/3) : x/(3*d*d) + (4/29);
	//let L = 100 * ToneResponse.LSTAR.oetf(Y);
	let L = 116 * f(Y/whiteLevel) - 16;
	let a = 500 * (f(X/Xn) - f(Y/whiteLevel));
	let b = 200 * (f(Y/whiteLevel) - f(Z/Zn));
	return [L, a, b];
}

function CIELAB_to_XYZ([L, a, b]: number[], { whiteLevel = 100, white = illuminants.D50 }: { whiteLevel: number, white: xy}): number[] {
	let [Xn, Zn] = [white.x*whiteLevel/white.y, (1-white.x-white.y)*whiteLevel/white.y];
	
	let d = 6/29
	let f = (x: number) => (x > d)? x*x*x : 3*d*d*(x - 4/29);
	let Lp = (L+16) / 116;

	let X = Xn * f(Lp + a/500);
	let Y = whiteLevel * f(Lp);
	let Z = Zn * f(Lp - b/200);

	return [X, Y, Z];
}


export { LABSPACE_CIELAB, XYZ_to_CIELAB, CIELAB_to_XYZ };