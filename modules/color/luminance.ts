/**
 * Color luminance module
 */

import { Color } from "../color";
import { XYZSpace } from "../../colorimetry";

function getLuminance(color: Color) {
	return color.get(XYZSpace.defaultSpace)[1];
}

function _getLuminance(this: Color) {
	return getLuminance(this);
}


declare module '../color' {
	interface Color {
		readonly luminance: ReturnType<typeof _getLuminance>;
	}
}

Object.defineProperty(Color.prototype, 'luminance', { get: _getLuminance });