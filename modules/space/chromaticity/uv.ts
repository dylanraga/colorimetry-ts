import { ChromaticitySpace } from "../chromaticity";
import { XYZSPACE_D65 } from "../xyz.standard";
import { CHROMATICITY_XY } from "./xy";

/* CIE1976 u'v' */
export const CHROMATICITY_UV = new ChromaticitySpace();
CHROMATICITY_UV.addConversion(XYZSPACE_D65,
	//CIE1976 u'v' -> XYZ
	(uv: number[], o: { whiteLevel?: number } = {}) => {
		let XYZ = uv_to_XYZ(uv, o);
		return XYZ;
	},
	//XYZ -> CIE1976 u'v'
	(XYZ: number[], o: {} = {}) => {
		let uv = XYZ_to_uv(XYZ);
		return uv;
	}
);
CHROMATICITY_UV.addConversion(CHROMATICITY_XY,
	//CIE1976 u'v' -> CIE1931 xy
	(uv: number[]) => {
		let xy = uv_to_xy(uv);
		return xy;
	},
	//CIE1931 xy -> CIE1976 u'v'
	(xy: number[]) => {
		let uv = xy_to_uv(xy);
		return uv;
	}
);
CHROMATICITY_UV.name = 'CIEuv';
CHROMATICITY_UV.keys = ['u', 'v'];
CHROMATICITY_UV.register('UV');

declare module '../chromaticity' {
	interface ChromaticitySpaceNamedMap {
		UV: typeof CHROMATICITY_UV;
	}
}


export function XYZ_to_uv([X, Y, Z]: number[]) {
	const denom = X + 15*Y + 3*Z;
	const u = 4*X / denom;
	const v = 9*Y / denom;

	return [u, v];
}

export function uv_to_XYZ([u, v]: number[], { whiteLevel = 1 }: { whiteLevel?: number }) {
	const denom = 4*v;
	const X = whiteLevel * (9*u)/denom;
	const Z = whiteLevel * (12-3*u-20*v)/denom;

	return [X, whiteLevel, Z];
}


export function xy_to_uv([x, y]: number[]): number[] {
	const denom = (-2*x + 12*y + 3);
	return [4*x / denom, 9*y / denom];
}

export function uv_to_xy([u, v]: number[]): number[] {
	const denom = (6*u - 16*v + 12);
	return [9*u / denom, 4*v / denom];
}