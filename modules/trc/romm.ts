/**
 * Kodak ProPhoto / ROMM
 */
import { evenFn } from '../common/util.js';
import { ToneResponse } from '../trc.js';

const Et = 1 / 512;

const WHITE_LEVEL = 1;
const BLACK_LEVEL = 0;

export const TRC_ROMM = new ToneResponse<{
	whiteLevel: number;
	blackLevel: number;
}>({
	id: 'romm',
	name: 'ROMM',
	eotf: (V, { whiteLevel = WHITE_LEVEL, blackLevel = BLACK_LEVEL } = {}) => {
		const f = (x: number) => (x < 16 * Et ? Math.max(0, x / 16) : Math.min(1, x ** 1.8));

		const L = (whiteLevel - blackLevel) * evenFn(f)(V) + blackLevel;
		return L;
	},
	invEotf: (L, { whiteLevel = WHITE_LEVEL, blackLevel = BLACK_LEVEL } = {}) => {
		const f = (x: number) => (x < Et ? Math.max(0, 16 * x) : Math.min(1, x ** (1 / 1.8)));

		const V = evenFn(f)((L - blackLevel) / (whiteLevel - blackLevel));
		return V;
	},
});

declare module '../trc' {
	interface ToneResponseNamedMap {
		romm: typeof TRC_ROMM;
	}
}
