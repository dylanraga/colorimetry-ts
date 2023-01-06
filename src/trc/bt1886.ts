/**
 * ITU-R BT.1886
 */
import { ToneResponse } from '../trc.js';

const WHITE_LUMINANCE = 1;
const BLACK_LUMINANCE = 0;
const GAMMA = 2.4;

export const TRC_BT1886 = new ToneResponse<{
	whiteLuminance: number;
	blackLuminance: number;
	gamma: number;
}>({
	id: 'bt1886',
	name: 'BT.1886',
	eotf: (V, { whiteLuminance = WHITE_LUMINANCE, blackLuminance = BLACK_LUMINANCE, gamma = GAMMA } = {}) => {
		const a = (whiteLuminance ** (1 / gamma) - blackLuminance ** (1 / gamma)) ** gamma;
		const b = blackLuminance ** (1 / gamma) / (whiteLuminance ** (1 / gamma) - blackLuminance ** (1 / gamma));

		const L = a * Math.max(V + b, 0) ** gamma;
		return L;
	},
	invEotf: (
		L,
		{ whiteLuminance = WHITE_LUMINANCE, blackLuminance = BLACK_LUMINANCE, gamma = GAMMA } = {}
	) => {
		const a = (whiteLuminance ** (1 / gamma) - blackLuminance ** (1 / gamma)) ** gamma;
		const b = blackLuminance ** (1 / gamma) / (whiteLuminance ** (1 / gamma) - blackLuminance ** (1 / gamma));

		const V = Math.max((L / a) ** (1 / gamma) - b, 0);
		return V;
	},
});

declare module '../trc' {
	interface ToneResponseNamedMap {
		bt1886: typeof TRC_BT1886;
	}
}
