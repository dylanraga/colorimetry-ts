/**
 * 1931 CIE xy chromaticity definitions and conversions
 */
import { ChromaticitySpace } from '../chromaticity.js';
import { XYZSPACE_D65_NORMALIZED } from '../xyz/predefined.js';

export const CHROMATICITY_XY = new ChromaticitySpace({
	id: 'xy',
	name: 'CIExy',
	keys: ['x', 'y'],
	conversions: [
		{
			space: XYZSPACE_D65_NORMALIZED,
			toFn: (xy, { refWhiteLevel = 1 } = {}) => xy_to_XnYnZn(xy, { refWhiteLevel: refWhiteLevel as number }),
			fromFn: XYZ_to_xy,
		},
	],
});

declare module '../chromaticity' {
	interface ChromaticitySpaceNamedMap {
		xy: typeof CHROMATICITY_XY;
	}
}

export function XYZ_to_xy([X, Y, Z]: number[]) {
	const denom = X + Y + Z;
	const x = X / denom;
	const y = Y / denom;

	return [x, y];
}

export function xy_to_XnYnZn([x, y]: number[], { refWhiteLevel = 1 } = {}) {
	const Xn = (refWhiteLevel * x) / y;
	const Zn = (refWhiteLevel * (1 - x - y)) / y;

	return [Xn, refWhiteLevel, Zn];
}

export interface xy {
	x: number;
	y: number;
}
