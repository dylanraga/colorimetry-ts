/**
 * ITU-R BT.1886
 */
import { ToneResponse } from '../trc.js';

const WHITE_LEVEL = 1;
const BLACK_LEVEL = 0;
const GAMMA = 2.4;

export const TRC_BT1886 = new ToneResponse<{
	whiteLevel: number;
	blackLevel: number;
	gamma: number;
}>({
	id: 'bt1886',
	name: 'BT.1886',
	eotf: (V, { whiteLevel = WHITE_LEVEL, blackLevel = BLACK_LEVEL, gamma = GAMMA } = {}) => {
		const a = (whiteLevel ** (1 / gamma) - blackLevel ** (1 / gamma)) ** gamma;
		const b = blackLevel ** (1 / gamma) / (whiteLevel ** (1 / gamma) - blackLevel ** (1 / gamma));

		const L = a * Math.max(V + b, 0) ** gamma;
		return L;
	},
	invEotf: (L, { whiteLevel = WHITE_LEVEL, blackLevel = BLACK_LEVEL, gamma = GAMMA } = {}) => {
		const a = (whiteLevel ** (1 / gamma) - blackLevel ** (1 / gamma)) ** gamma;
		const b = blackLevel ** (1 / gamma) / (whiteLevel ** (1 / gamma) - blackLevel ** (1 / gamma));

		const V = Math.max((L / a) ** (1 / gamma) - b, 0);
		return V;
	},
});

declare module '../trc' {
	interface ToneResponseNamedMap {
		bt1886: typeof TRC_BT1886;
	}
}
