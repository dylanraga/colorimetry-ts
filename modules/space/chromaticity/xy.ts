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
			toFn: (xy, { refWhiteLuminance = 1 } = {}) =>
				xy_to_XnYnZn(xy, { refWhiteLuminance: refWhiteLuminance as number }),
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

export function xy_to_XnYnZn([x, y]: number[], { refWhiteLuminance = 1 } = {}) {
	const Xn = (refWhiteLuminance * x) / y;
	const Zn = (refWhiteLuminance * (1 - x - y)) / y;

	return [Xn, refWhiteLuminance, Zn];
}

export interface xy {
	x: number;
	y: number;
}
