/**
 * Color luminance module
 */
import { Color } from '../color.js';
import { XYZSPACE_D65 } from '../space/xyz/predefined.js';

function getLuminance(color: Color) {
	return color.get(XYZSPACE_D65)[1];
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
