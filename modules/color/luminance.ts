/**
 * Color luminance module
 */

import { Color } from "../color";
import { XYZSpace } from "../../colorimetry";

function getLuminance(color: Color) {
	return color.get(XYZSpace.defaultSpace)[1];
}

Object.defineProperty(Color.prototype, 'luminance', { get: function() { return getLuminance(this); } });

declare module '../color' {
	interface Color {
		luminance: ReturnType<typeof getLuminance>
	}
}
