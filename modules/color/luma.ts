/**
 * Color luma module
 */

import { Color } from '../color.js';
import { RGBLinearSpace } from '../space/rgb-linear.js';
import { RGBLINEARSPACE_SRGB } from '../space/rgb-linear/predefined.js';

function getLuma(color: Color, rgbSpace: RGBLinearSpace) {
	const [yr, yg, yb] = rgbSpace.gamut.getMatrixRGBToXYZ()[1];
	const [r, g, b] = color.get(rgbSpace);
	const luma = r * yr + g * yg + b * yb;
	return luma;
}

function _getLuma(this: Color, rgbSpace: RGBLinearSpace = RGBLINEARSPACE_SRGB) {
	return getLuma(this, rgbSpace);
}

declare module '../color' {
	interface Color {
		readonly luma: ReturnType<typeof _getLuma>;
	}
}

Object.defineProperty(Color.prototype, 'luma', { get: _getLuma });
