/**
 * Hybrid-Log Gamma / Rec.2100 / ARIB STD-B67
 */
import { ToneResponse } from '../trc.js';

const a = 0.17883277;
const b = 0.28466892;
const c = 0.559910729529562;

const WHITE_LEVEL = 203;
const PEAK_LUMINANCE = 1000;
const BLACK_LEVEL = 0;
const GAMMA = 1.2;

export const TRC_HLG = new ToneResponse<{
	peakLuminance: number;
	blackLevel: number;
	gamma: number;
}>({
	id: 'hlg',
	name: 'HLG',
	eotf: (V, { peakLuminance = PEAK_LUMINANCE, blackLevel = BLACK_LEVEL, gamma = GAMMA } = {}) => {
		const _gamma = gamma + 0.42 * Math.log10(peakLuminance / 1000);
		const beta = Math.sqrt(3 * (blackLevel / peakLuminance) ** (1 / _gamma));

		const f = (x: number) => (x > 1 / 2 ? (Math.exp((x - c) / a) + b) / 12 : (x * x) / 3);
		const E = f(Math.max(0, V * (1 - beta) + beta));
		const L = peakLuminance * E ** _gamma;

		return Number(L.toPrecision(8));
	},
	invEotf: (L, { peakLuminance = PEAK_LUMINANCE, blackLevel = BLACK_LEVEL, gamma = GAMMA } = {}) => {
		const _gamma = gamma + 0.42 * Math.log10(peakLuminance / 1000);
		const beta = Math.sqrt(3 * (blackLevel / peakLuminance) ** (1 / _gamma));

		const E = (L / peakLuminance) ** (1 / _gamma);
		let V = E > 1 / 12 ? a * Math.log(12 * E - b) + c : Math.sqrt(E * 3);
		V = Math.max(0, (+V.toPrecision(8) - beta) / (1 - beta));

		return V;
	},
});

declare module '../trc' {
	interface ToneResponseNamedMap {
		hlg: typeof TRC_HLG;
	}
}
