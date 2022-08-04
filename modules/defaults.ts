/**
 * Defaults
 */

import { ColorSpace } from "./space";

import { XYZSpace } from "./space/xyz";
import { XYZSPACE_D65 } from "./space/xyz.standard";
XYZSpace.defaultSpace = XYZSPACE_D65;
Object.defineProperty(ColorSpace.named, "XYZ", { get: () => XYZSpace.defaultSpace });

import { RGBSpace } from "./space/rgb";
import { RGBSPACE_SRGB } from './space/rgb.standard';
RGBSpace.defaultSpace = RGBSPACE_SRGB;
Object.defineProperty(ColorSpace.named, "RGB", { get: () => RGBSpace.defaultSpace });

declare module './space' {
	interface ColorSpaceNamedMap {
		XYZ: typeof XYZSpace.defaultSpace;
		RGB: typeof RGBSpace.defaultSpace;
	}
}