import { ColorSpace } from "../../space";
import { LabSpace } from "../lab";
import { XYZSPACE_CIED65 } from "../xyz.standard";

/* CIE1931 Yxy */
export const LABSPACE_CIE1931 = new LabSpace();
LABSPACE_CIE1931.addConversion(XYZSPACE_CIED65,
	//CIE1931 -> XYZ
	(Yxy: number[], o: {} = {}) => {
		let XYZ = Yxy_to_XYZ(Yxy);
		return XYZ;
	},
	//XYZ -> CIE1931
	(XYZ: number[], o: {} = {}) => {
		let Yxy = XYZ_to_Yxy(XYZ);
		return Yxy;
	}
);
LABSPACE_CIE1931.name = 'CIEYxy';
LABSPACE_CIE1931.keys = ['Y', 'x', 'y'];
ColorSpace.list[LABSPACE_CIE1931.name] = LABSPACE_CIE1931;
ColorSpace.list['YXY'] = LABSPACE_CIE1931;
ColorSpace.list['XYY'] = LABSPACE_CIE1931;


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
