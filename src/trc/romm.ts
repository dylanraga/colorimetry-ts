/**
 * Kodak ProPhoto / ROMM
 */
import { evenFn } from '../common/util.js';
import { ToneResponse } from '../trc.js';

const Et = 1 / 512;

const WHITE_LUMINANCE = 1;
const BLACK_LUMINANCE = 0;

export const TRC_ROMM = new ToneResponse<{
	whiteLuminance: number;
	blackLuminance: number;
}>({
	id: 'romm',
	name: 'ROMM',
	eotf: (V, { whiteLuminance = WHITE_LUMINANCE, blackLuminance = BLACK_LUMINANCE } = {}) => {
		const f = (x: number) => (x < 16 * Et ? Math.max(0, x / 16) : Math.min(1, x ** 1.8));

		const L = (whiteLuminance - blackLuminance) * evenFn(f)(V) + blackLuminance;
		return L;
	},
	invEotf: (L, { whiteLuminance = WHITE_LUMINANCE, blackLuminance = BLACK_LUMINANCE } = {}) => {
		const f = (x: number) => (x < Et ? Math.max(0, 16 * x) : Math.min(1, x ** (1 / 1.8)));

		const V = evenFn(f)((L - blackLuminance) / (whiteLuminance - blackLuminance));
		return V;
	},
});

declare module '../trc' {
	interface ToneResponseNamedMap {
		romm: typeof TRC_ROMM;
	}
}
