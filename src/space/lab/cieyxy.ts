/**
 * 1931 CIE Yxy definitions and conversions
 */
import { LabSpace } from '../lab.js';
import { XYZSPACE_D65 } from '../xyz/predefined.js';

export const LABSPACE_CIEYXY = new LabSpace({
	id: 'Yxy',
	name: 'CIE1931 Yxy',
	keys: ['Y', 'x', 'y'],
	conversions: [
		{
			space: XYZSPACE_D65,
			toFn: Yxy_to_XYZ,
			fromFn: XYZ_to_Yxy,
		},
	],
});

declare module '../lab' {
	interface LabSpaceNamedMap {
		Yxy: typeof LABSPACE_CIEYXY;
	}
}

/**
 * CIE1931 Yxy<->XYZ conversion functions
 */
export function Yxy_to_XYZ([Y, x, y]: number[]) {
	const X = (x * Y) / y;
	const Z = ((1 - x - y) * Y) / y;

	return [X, Y, Z];
}

export function XYZ_to_Yxy([X, Y, Z]: number[]) {
	const denom = X + Y + Z;
	const x = X / denom;
	const y = Y / denom;

	return [Y, x, y];
}

export interface Yxy {
	Y: number;
	x: number;
	y: number;
}
