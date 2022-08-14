/**
 * 1976 CIE u'v' chromaticity definitions and conversions
 */
import { ChromaticitySpace } from '../chromaticity.js';
import { XYZSPACE_D65_NORMALIZED } from '../xyz/predefined.js';
import { CHROMATICITY_XY } from './xy.js';

/* CIE1976 u'v' */
export const CHROMATICITY_UV = new ChromaticitySpace({
	id: 'uv',
	name: 'CIEuv',
	keys: ['u', 'v'],
	conversions: [
		{
			space: XYZSPACE_D65_NORMALIZED,
			toFn: (uv, { refWhiteLevel } = {}) => uv_to_XnYnZn(uv, { refWhiteLevel: refWhiteLevel as number }),
			fromFn: XYZ_to_uv,
		},
		{
			space: CHROMATICITY_XY,
			toFn: uv_to_xy,
			fromFn: xy_to_uv,
		},
	],
});

declare module '../chromaticity' {
	interface ChromaticitySpaceNamedMap {
		uv: typeof CHROMATICITY_UV;
	}
}

export function XYZ_to_uv([X, Y, Z]: number[]) {
	const denom = X + 15 * Y + 3 * Z;
	const u = (4 * X) / denom;
	const v = (9 * Y) / denom;

	return [u, v];
}

export function uv_to_XnYnZn([u, v]: number[], { refWhiteLevel = 1 } = {}) {
	const denom = 4 * v;
	const Xn = (refWhiteLevel * (9 * u)) / denom;
	const Zn = (refWhiteLevel * (12 - 3 * u - 20 * v)) / denom;

	return [Xn, refWhiteLevel, Zn];
}

export function xy_to_uv([x, y]: number[]): number[] {
	const denom = -2 * x + 12 * y + 3;

	return [(4 * x) / denom, (9 * y) / denom];
}

export function uv_to_xy([u, v]: number[]): number[] {
	const denom = 6 * u - 16 * v + 12;

	return [(9 * u) / denom, (4 * v) / denom];
}
