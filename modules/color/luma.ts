/**
 * Color luma module
 */

import { Color } from '../color.js';
import { RGBEncodedSpace } from '../space/rgb-encoded.js';
import { RGBSPACE_SRGB } from '../space/rgb-encoded/predefined.js';

function getLuma(color: Color, rgbSpace: RGBEncodedSpace) {
	const [yr, yg, yb] = rgbSpace.gamut.getMatrixRGBToXYZ()[1];
	const [r, g, b] = color.get(rgbSpace);
	const luma = r * yr + g * yg + b * yb;
	return luma;
}

function _getLuma(this: Color, rgbSpace: RGBEncodedSpace = RGBSPACE_SRGB) {
	return getLuma(this, rgbSpace);
}

declare module '../color' {
	interface Color {
		readonly luma: ReturnType<typeof _getLuma>;
	}
}

Object.defineProperty(Color.prototype, 'luma', { get: _getLuma });
