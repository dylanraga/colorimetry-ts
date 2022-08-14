/**
 * ST.2084 HDR / Rec.2100
 * TODO: Add tonemap knee w.r.t whiteLevel & blackLevel
 */
import { ToneResponse } from '../trc.js';

const m1 = 0.1593017578125;
const m2 = 78.84375;
const c1 = 0.8359375;
const c2 = 18.8515625;
const c3 = 18.6875;

const PEAK_LUMINANCE = 10000;
const BLACKLEVEL = 0;
const M2 = m2;

export const TRC_ST2084 = new ToneResponse<{
	peakLuminance: number;
	blackLevel: number;
	m2: number;
}>({
	id: 'st2084',
	name: 'Dolby PQ (ST.2084)',
	alias: ['pq'],
	eotf: (V, { peakLuminance = PEAK_LUMINANCE, blackLevel = BLACKLEVEL, m2 = M2 } = {}) => {
		const L = peakLuminance * (Math.max(V ** (1 / m2) - c1, 0) / (c2 - c3 * V ** (1 / m2))) ** (1 / m1);
		//return Math.max(Math.min(L, whiteLevel), blackLevel);
		return L;
	},
	invEotf: (L, { peakLuminance = PEAK_LUMINANCE, blackLevel = BLACKLEVEL, m2 = M2 } = {}) => {
		const V = ((c1 + c2 * (L / peakLuminance) ** m1) / (1 + c3 * (L / peakLuminance) ** m1)) ** m2;
		return V;
	},
});

declare module '../trc' {
	interface ToneResponseNamedMap {
		st2084: typeof TRC_ST2084;
		pq: typeof TRC_ST2084;
	}
}
