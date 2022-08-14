/**
 * Extended sRGB, using higher-precision constants
 * https://entropymine.com/imageworsener/srgbformula/
 */
import { evenFn } from '../common/util.js';
import { ToneResponse } from '../trc.js';

const X1 = 0.0404482362771082;
const X2 = 0.00313066844250063;

const WHITE_LEVEL = 1;
const BLACK_LEVEL = 0;

export const TRC_SRGB = new ToneResponse<{
	whiteLevel: number;
	blackLevel: number;
}>({
	id: 'srgb',
	name: 'Piecewise sRGB',
	eotf: (V, { whiteLevel = WHITE_LEVEL, blackLevel = BLACK_LEVEL } = {}) => {
		const f = (x: number) => (x <= X1 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);

		const L = (whiteLevel - blackLevel) * evenFn(f)(V) + blackLevel;
		return L;
	},
	invEotf: (L, { whiteLevel = WHITE_LEVEL, blackLevel = BLACK_LEVEL } = {}) => {
		const f = (x: number) => (x <= X2 ? x * 12.92 : 1.055 * x ** (1 / 2.4) - 0.055);

		const V = evenFn(f)((L - blackLevel) / (whiteLevel - blackLevel));
		return V;
	},
});

declare module '../trc' {
	interface ToneResponseNamedMap {
		srgb: typeof TRC_SRGB;
	}
}
