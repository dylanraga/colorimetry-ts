/**
 * Simple gamma power function
 */
import { evenFn } from '../common/util.js';
import { ToneResponse } from '../trc.js';

const WHITE_LEVEL = 1;
const BLACK_LEVEL = 0;
const GAMMA = 2.2;

export const TRC_GAMMA = new ToneResponse<{
	whiteLevel: number;
	blackLevel: number;
	gamma: number;
}>({
	id: 'gamma',
	name: 'Gamma Power',
	eotf: (V, { whiteLevel = WHITE_LEVEL, blackLevel = BLACK_LEVEL, gamma = GAMMA } = {}) => {
		const f = (x: number) => x ** gamma;

		const L = (whiteLevel - blackLevel) * evenFn(f)(V) + blackLevel;
		return L;
	},
	invEotf: (L, { whiteLevel = WHITE_LEVEL, blackLevel = BLACK_LEVEL, gamma = GAMMA } = {}) => {
		const f = (x: number) => x ** (1 / gamma);

		const V = evenFn(f)((L - blackLevel) / (whiteLevel - blackLevel));
		return V;
	},
});

TRC_GAMMA.props({ gamma: 1.8 }, { id: 'gamma_18', name: 'Gamma Power 1.8' });
TRC_GAMMA.props({ gamma: 2.2 }, { id: 'gamma_22', name: 'Gamma Power 2.2' });
TRC_GAMMA.props({ gamma: 2.4 }, { id: 'gamma_24', name: 'Gamma Power 2.4' });
TRC_GAMMA.props({ gamma: 2.6 }, { id: 'gamma_26', name: 'Gamma Power 2.6' });

declare module '../trc' {
	interface ToneResponseNamedMap {
		gamma: typeof TRC_GAMMA;
		gamma_18: typeof TRC_GAMMA;
		gamma_22: typeof TRC_GAMMA;
		gamma_24: typeof TRC_GAMMA;
		gamma_26: typeof TRC_GAMMA;
	}
}
