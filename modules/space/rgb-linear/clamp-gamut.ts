import { Color } from '../../color.js';
import { LABSPACE_ITP } from '../lab/ictcp.js';
import { RGBLinearSpace } from '../rgb-linear.js';
import { RGBLINEARSPACE_SRGB } from './predefined.js';

export function clamp(v: number, min: number, max: number) {
	if (v < min) return min;
	if (v > max) return max;

	return v;
}

const lchSpace = LABSPACE_ITP.toLCh();
// ΔEITP JND = 1/720 = 0.00139
const jnd = 1 / 720;

// Clamps out-of-gamut rgb values in-gamut with minimum chroma loss
// Process:
// - Compare rgb value to clipped rgb value:
// -- If ΔEITP < 3, return clipped rgb
// -- Otherwise, reduce chroma by sqrt(1/2) * ΔEITP and re-compare
export function clampInGamut(
	rgb: number[],
	rgbSpace: RGBLinearSpace = RGBLINEARSPACE_SRGB,
	whiteLuminance = 1,
	blackLuminance = 0,
	tolerance = 1
) {
	if (Math.min(...rgb) >= blackLuminance && Math.max(...rgb) <= whiteLuminance) {
		return rgb;
	}

	let rgbClamped = rgb.map((u) => clamp(u, blackLuminance, whiteLuminance));

	const rgbLch = new Color(rgbSpace, rgb).get(lchSpace);

	let dEFromClipped = Color.dE(new Color(lchSpace, rgbLch), new Color(rgbSpace, rgbClamped));
	console.log('currRgb', rgb, rgbClamped, dEFromClipped);
	while (dEFromClipped > tolerance) {
		// Give up on significantly higher or lower lightness clampings
		if (rgbLch[1] < jnd) {
			return rgbClamped;
		}
		rgbLch[1] -= jnd * (Math.SQRT1_2 * dEFromClipped);
		let currLchColor = new Color(lchSpace, rgbLch);
		let currRgb = currLchColor.get(rgbSpace);
		// if in-gamut, push out of gamut
		while (Math.min(...currRgb) > blackLuminance && Math.max(...currRgb) < whiteLuminance) {
			rgbLch[1] += jnd * (0.1 * dEFromClipped);
			currLchColor = new Color(lchSpace, rgbLch);
			currRgb = currLchColor.get(rgbSpace);
		}
		rgbClamped = currRgb.map((u) => clamp(u, blackLuminance, whiteLuminance));
		dEFromClipped = Color.dE(currLchColor, new Color(rgbSpace, rgbClamped));
		console.log('currRgb', currRgb, rgbClamped, dEFromClipped);
	}

	return rgbClamped;
}
