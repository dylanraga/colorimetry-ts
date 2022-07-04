/**
 * CIELAB conversion functions.
 * ----------------------------
 * Use illuminant D50 since CIELAB was intended for reflective surfaces, not emissive/transmissive displays.
 * Currently using "wrong" Von Kries/XYZ scaling per spec; consider implementing manual Bradford CAT option in the future
 */

import { XYZSpace } from '../XYZ/XYZSpace';
import { LabSpace } from './LabSpace';
import { illuminants } from '../../Illuminants/Illuminants';

interface xy { x: number, y: number }

const LABSPACE_CIELAB = new LabSpace(['L', 'a', 'b']);
LABSPACE_CIELAB.addConversion(XYZSpace.defaultSpace,
	(Lab: number[], o: { whiteY?: number, white?: xy } = {}) => {
		const { whiteY, white } = o;
		let XYZ = CIELAB_to_XYZ(Lab, whiteY, white);
		return XYZ;
	},
	(XYZ: number[], o: { whiteY?: number, white?: xy } = {}) => {
		const { whiteY, white } = o;
		let Lab = XYZ_to_CIELAB(XYZ, whiteY, white);
		return Lab;
	});
LABSPACE_CIELAB.name = 'CIELab';

function XYZ_to_CIELAB([X, Y, Z]: number[], whiteY: number = 100, white: xy = illuminants.D50): number[] {
	let [Xn, Zn] = [white.x*whiteY/white.y, (1-white.x-white.y)*whiteY/white.y];
	let d = 6/29;
	let f = (x: number) => (x > d*d*d)? x**(1/3) : x/(3*d*d) + (4/29);
	//let L = 100 * ToneResponse.LSTAR.oetf(Y);
	let L = 116 * f(Y/whiteY) - 16;
	let a = 500 * (f(X/Xn) - f(Y/whiteY));
	let b = 200 * (f(Y/whiteY) - f(Z/Zn));
	return [L, a, b];
}

function CIELAB_to_XYZ([L, a, b]: number[], whiteY: number = 100, white: xy = illuminants.D50): number[] {
	let [Xn, Zn] = [white.x*whiteY/white.y, (1-white.x-white.y)*whiteY/white.y];
	
	let d = 6/29
	let f = (x: number) => (x > d)? x*x*x : 3*d*d*(x - 4/29);
	let Lp = (L+16) / 116;

	let X = Xn * f(Lp + a/500);
	let Y = whiteY * f(Lp);
	let Z = Zn * f(Lp - b/200);

	return [X, Y, Z];
}

export { LABSPACE_CIELAB, XYZ_to_CIELAB, CIELAB_to_XYZ };
