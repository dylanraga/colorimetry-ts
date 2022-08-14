import { ILLUMINANT_D65 } from '../../illuminants/predefined.js';
import { XYZSpace } from '../xyz.js';

export const XYZSPACE_D65 = new XYZSpace({
	id: 'xyz_d65',
	alias: ['xyz'],
	name: 'XYZ D65',
	illuminant: ILLUMINANT_D65,
});

export const XYZSPACE_D65_NORMALIZED = new XYZSpace({
	id: 'xyz_n_d65',
	alias: ['xyz_n'],
	name: 'XYZ Normalized D65',
	keys: ['Xn', 'Yn', 'Zn'],
	illuminant: ILLUMINANT_D65,
	refWhiteLevel: XYZSPACE_D65.refWhiteLevel,
	refBlackLevel: XYZSPACE_D65.refBlackLevel,
	conversions: [
		{
			space: XYZSPACE_D65,
			// Normalized XYZ -> Absolute XYZ
			toFn: function (
				this: XYZSpace,
				[Xn, Yn, Zn],
				{
					rgbWhiteLevel,
					rgbBlackLevel,
					refWhiteLevel = rgbWhiteLevel ?? XYZSPACE_D65.refWhiteLevel,
					refBlackLevel = rgbBlackLevel ?? XYZSPACE_D65.refBlackLevel,
				} = {}
			) {
				const Y = (refWhiteLevel - refBlackLevel) * Yn + refBlackLevel;
				const X = (Y * Xn) / Yn;
				const Z = (Y * Zn) / Yn;
				return [X, Y, Z];
			},
			// Absolute XYZ -> Normalized XYZ
			fromFn: function (
				this: XYZSpace,
				[X, Y, Z],
				{
					rgbWhiteLevel,
					rgbBlackLevel,
					refWhiteLevel = rgbWhiteLevel ?? XYZSPACE_D65.refWhiteLevel,
					refBlackLevel = rgbBlackLevel ?? XYZSPACE_D65.refBlackLevel,
				} = {}
			) {
				const Yn = (Y - refBlackLevel) / (refWhiteLevel - refBlackLevel);
				const Xn = (X * Yn) / Y;
				const Zn = (Z * Yn) / Y;
				return [Xn, Yn, Zn];
			},
		},
	],
});

declare module '../xyz' {
	interface XYZSpaceNamedMap {
		xyz_d65: typeof XYZSPACE_D65;
		xyz: typeof XYZSPACE_D65;
		xyz_n_d65: typeof XYZSPACE_D65_NORMALIZED;
		xyz_n: typeof XYZSPACE_D65_NORMALIZED;
	}
}
