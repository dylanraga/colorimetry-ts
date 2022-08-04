/**
 * Color luma module
 */

import { Color } from "../color";
import { RGBSpace } from "../../colorimetry";

function getLuma(color: Color, rgbSpace: RGBSpace) {
	const [yr, yg, yb] = rgbSpace.gamut.mXYZ[1];
	const [r, g, b] = color.get(rgbSpace);
	const luma = r*yr + g*yg + b*yb;
	return luma;
}

function _getLuma(this: Color, rgbSpace: Parameters<typeof getLuma>['1'] = RGBSpace.defaultSpace) {
	return getLuma(this, rgbSpace);
}


declare module '../color' {
	interface Color {
		readonly luma: ReturnType<typeof _getLuma>;
	}
}

Object.defineProperty(Color.prototype, 'luma', { get: _getLuma });