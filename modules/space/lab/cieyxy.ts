import { LabSpace } from "../lab";
import { XYZSPACE_D65 } from "../xyz.standard";

/* CIE1931 Yxy */
export const LABSPACE_CIEYXY = new LabSpace();
LABSPACE_CIEYXY.name = 'CIE1931 Yxy';
LABSPACE_CIEYXY.keys = ['Y', 'x', 'y'];

LABSPACE_CIEYXY.addConversion(XYZSPACE_D65,
	//Yxy -> XYZ
	(Yxy: number[]) => Yxy_to_XYZ(Yxy),
	//XYZ -> Yxy
	(XYZ: number[]) => XYZ_to_Yxy(XYZ)
);
LABSPACE_CIEYXY.register(['YXY', 'XYY']);

declare module '../lab' {
	interface LabSpaceNamedMap {
		YXY: LabSpace;
		XYY: LabSpace;
	}
}

/**
 * CIE1931 Yxy<->XYZ conversion functions
 */

export function Yxy_to_XYZ([Y, x, y]: number[]) {
	const X = x*Y/y;
	const Z = (1-x-y)*Y/y;

	return [X, Y, Z];
}

export function XYZ_to_Yxy([X, Y, Z]: number[]) {
	const denom = X+Y+Z;
	const x = X/denom;
	const y = Y/denom;

	return [Y, x, y];
}
