/**
 * Color luma module
 */

import { Color } from "../color";
import { RGBSpace } from "../../colorimetry";
import { DEFAULT_RGBSPACE } from "../defaults";

function getLuma(color: Color, rgbSpace: RGBSpace) {
	const [yr, yg, yb] = rgbSpace.gamut.mXYZ[1];
	const [r, g, b] = color.get(rgbSpace);
	const luma = r*yr + g*yg + b*yb;
	return luma;
}

Color.prototype.luma = function(rgbSpace: RGBSpace = DEFAULT_RGBSPACE) {
	return getLuma(this, rgbSpace);
};


declare module '../color' {
	interface Color {
		luma: (rgbSpace?: RGBSpace) => ReturnType<typeof getLuma>
	}
}
