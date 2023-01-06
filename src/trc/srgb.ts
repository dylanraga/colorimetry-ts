/**
 * Extended sRGB, using higher-precision constants
 * https://entropymine.com/imageworsener/srgbformula/
 */
import { evenFn } from '../common/util.js';
import { ToneResponse } from '../trc.js';

const X1 = 0.0404482362771082;
const X2 = 0.00313066844250063;

const WHITE_LUMINANCE = 1;
const BLACK_LUMINANCE = 0;

export const TRC_SRGB = new ToneResponse<{
	whiteLuminance: number;
	blackLuminance: number;
}>({
	id: 'srgb',
	name: 'Piecewise sRGB',
	eotf: (V, { whiteLuminance = WHITE_LUMINANCE, blackLuminance = BLACK_LUMINANCE } = {}) => {
		const f = (x: number) => (x <= X1 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);

		const L = (whiteLuminance - blackLuminance) * evenFn(f)(V) + blackLuminance;
		return L;
	},
	invEotf: (L, { whiteLuminance = WHITE_LUMINANCE, blackLuminance = BLACK_LUMINANCE } = {}) => {
		const f = (x: number) => (x <= X2 ? x * 12.92 : 1.055 * x ** (1 / 2.4) - 0.055);

		const V = evenFn(f)((L - blackLuminance) / (whiteLuminance - blackLuminance));
		return V;
	},
});

declare module '../trc' {
	interface ToneResponseNamedMap {
		srgb: typeof TRC_SRGB;
	}
}
