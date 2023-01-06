/**
 * Correlated Color Temperature module
 */

import { uv_to_CCT } from '../cct.js';
import { Color } from '../color.js';
import { CHROMATICITY_UV } from '../space/chromaticity/uv.js';

/**
 * Calculates the Correlated Color Temperature of a Color in Kelvin
 * @param color Color to find CCT of
 */
function getCCT(color: Color) {
	const [up, vp] = color.get(CHROMATICITY_UV);

	return uv_to_CCT([up, (2 * vp) / 3]);
}

function _getCCT(this: Color) {
	return getCCT(this);
}

declare module '../color' {
	interface Color {
		readonly cct: ReturnType<typeof _getCCT>;
	}
}

Object.defineProperty(Color.prototype, 'cct', { get: _getCCT });
