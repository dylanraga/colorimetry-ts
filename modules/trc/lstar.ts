/**
 * CIELab L*
 * http://www.brucelindbloom.com/index.html?Eqn_Luv_to_XYZ.html
 */
import { evenFn } from '../common/util.js';
import { ToneResponse } from '../trc.js';

const κ = 24389 / 27;
const ϵ = 216 / 24389;
const d = 6 / 29;

const WHITE_LEVEL = 1;
const BLACK_LEVEL = 0;

export const TRC_LSTAR = new ToneResponse<{
	whiteLevel: number;
	blackLevel: number;
}>({
	id: 'lstar',
	name: 'L*',
	eotf: (V, { whiteLevel = WHITE_LEVEL, blackLevel = BLACK_LEVEL } = {}) => {
		const f = (x: number) => (x > d ? ((x + 16) / 116) ** 3 : x / κ);
		const L = (whiteLevel - blackLevel) * evenFn(f)(100 * V) + blackLevel;
		return L;
	},
	invEotf: (L, { whiteLevel = WHITE_LEVEL, blackLevel = BLACK_LEVEL } = {}) => {
		const f = (x: number) => (x > ϵ ? 116 * Math.cbrt(x) - 16 : κ * x);
		const V = evenFn(f)((L - blackLevel) / (whiteLevel - blackLevel)) / 100;
		return V;
	},
});

declare module '../trc' {
	interface ToneResponseNamedMap {
		lstar: typeof TRC_LSTAR;
	}
}
