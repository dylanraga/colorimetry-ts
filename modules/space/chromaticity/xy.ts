import { ChromaticitySpace } from "../chromaticity";
import { XYZSPACE_D65 } from "../xyz.standard";

interface xy {
	x: number;
	y: number;
}

/* CIE1931 xy */
export const CHROMATICITY_XY = new ChromaticitySpace();
CHROMATICITY_XY.addConversion(XYZSPACE_D65,
	//CIExy -> XYZ
	(xy: number[], o: { whiteLevel?: number } = {}) => {
		let XYZ = xy_to_XYZ(xy, o);
		return XYZ;
	},
	//XYZ -> CIExy
	(XYZ: number[], o: {} = {}) => {
		let xy = XYZ_to_xy(XYZ);
		return xy;
	}
);
CHROMATICITY_XY.name = 'CIExy';
CHROMATICITY_XY.keys = ['x', 'y'];
CHROMATICITY_XY.register('XY');


declare module '../chromaticity' {
	interface ChromaticitySpaceNamedMap {
		XY: typeof CHROMATICITY_XY;
	}
}


export function XYZ_to_xy([X, Y, Z]: number[]) {
	const denom = X+Y+Z;
	const x = X/denom;
	const y = Y/denom;

	return [x, y];
}

export function xy_to_XYZ([x, y]: number[], { whiteLevel = 1 }: { whiteLevel?: number }) {
	const X = x*whiteLevel/y;
	const Z = (1-x-y)*whiteLevel/y;

	return [X, whiteLevel, Z];
}