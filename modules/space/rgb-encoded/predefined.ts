import { gamuts } from '../../gamut.js';
import { curves } from '../../trc.js';
import { TRC_HLG } from '../../trc/hlg.js';
import { TRC_ST2084 } from '../../trc/st2084.js';
import { RGBEncodedSpace } from '../rgb-encoded.js';

// sRGB IEC 61966-2-1:1999
export const RGBSPACE_SRGB = new RGBEncodedSpace({
	id: 'srgb',
	name: 'sRGB',
	gamut: gamuts.srgb,
	trc: curves.srgb,
	whiteLevel: 80,
	blackLevel: 0.2,
});
export const RGBSPACE_SRGB_8 = RGBSPACE_SRGB.toDigital(8).register('srgb_8');

// Rec. 709 with BT.1886 transfer
export const RGBSPACE_REC709 = new RGBEncodedSpace({
	id: 'rec709',
	name: 'Rec. 709',
	alias: ['bt709'],
	gamut: gamuts.srgb,
	trc: curves.bt1886,
	whiteLevel: 100,
	blackLevel: 0,
});

// Apple Inc. Display P3
export const RGBSPACE_DISPLAYP3 = new RGBEncodedSpace({
	id: 'display_p3',
	name: 'Display P3',
	alias: ['p3', 'p3_d65'],
	gamut: gamuts.p3_d65,
	trc: curves.srgb,
	whiteLevel: 80,
	blackLevel: 0.2,
});

// Digital Cinema Initiative P3
export const RGBSPACE_DCIP3 = new RGBEncodedSpace({
	id: 'p3_dci',
	name: 'DCI-P3',
	alias: ['dci_p3'],
	gamut: gamuts.p3_dci,
	trc: curves.gamma_26,
	whiteLevel: 48,
	blackLevel: 0.005,
});

// Adobe RGB (1998) IEC 61966-2-5:2007
export const RGBSPACE_ADOBERGB = new RGBEncodedSpace({
	id: 'adobe',
	name: 'Adobe RGB 1998',
	alias: ['argb', 'a98'],
	gamut: gamuts.adobe,
	trc: curves.gamma.props({ gamma: 563 / 256 }),
	whiteLevel: 160,
	blackLevel: 0.5557,
});

// BT.2020 gamut with BT.1886 transfer
export const RGBSPACE_REC2020 = new RGBEncodedSpace({
	id: 'rec2020',
	name: 'Rec. 2020',
	alias: ['bt2020'],
	gamut: gamuts.bt2020,
	trc: curves.bt1886,
	whiteLevel: 100,
	blackLevel: 0,
});

// BT.2100: BT.2020 with ST.2084 transfer
export const RGBSPACE_BT2100_PQ = new RGBEncodedSpace({
	id: 'bt2100_pq',
	name: 'BT.2100 PQ',
	alias: ['bt2100', 'rec2100', 'rec2100_pq'],
	gamut: gamuts.bt2020,
	trc: curves.st2084,
	peakLuminance: 10000,
	whiteLevel: TRC_ST2084.eotf(0.58),
	blackLevel: 0.0001,
});

// BT.2100: BT.2020 with HLG transfer
export const RGBSPACE_BT2100_HLG = new RGBEncodedSpace({
	id: 'bt2100_hlg',
	name: 'BT.2100 HLG',
	alias: ['rec2100_hlg'],
	gamut: gamuts.bt2020,
	trc: curves.hlg,
	peakLuminance: 1000,
	whiteLevel: TRC_HLG.eotf(0.75),
	blackLevel: 0,
});

// Kodak ProPhoto RGB
export const RGBSPACE_PROPHOTO = new RGBEncodedSpace({
	id: 'prophoto',
	name: 'ProPhoto RGB',
	alias: ['romm'],
	gamut: gamuts.prophoto,
	trc: curves.romm,
	whiteLevel: 160,
	blackLevel: 0.1,
});

// ACEScc
export const RGBSPACE_ACESCC = new RGBEncodedSpace({
	id: 'acescc',
	name: 'ACEScc',
	gamut: gamuts.aces_p1,
	trc: curves.acescc,
});

declare module '../rgb-encoded' {
	interface RGBEncodedSpaceNamedMap {
		srgb: typeof RGBSPACE_SRGB;
		srgb_8: typeof RGBSPACE_SRGB_8;
		rec709: typeof RGBSPACE_REC709;
		display_p3: typeof RGBSPACE_DISPLAYP3;
		p3_dci: typeof RGBSPACE_DCIP3;
		rec2020: typeof RGBSPACE_REC2020;
		bt2100_pq: typeof RGBSPACE_BT2100_PQ;
		bt2100_hlg: typeof RGBSPACE_BT2100_HLG;
		prophoto: typeof RGBSPACE_PROPHOTO;
		acescc: typeof RGBSPACE_ACESCC;
		/**
		 * Aliases
		 */
		bt709: typeof RGBSPACE_REC709;
		p3: typeof RGBSPACE_DISPLAYP3;
		p3_d65: typeof RGBSPACE_DISPLAYP3;
		dci_p3: typeof RGBSPACE_DCIP3;
		bt2020: typeof RGBSPACE_REC2020;
		bt2100: typeof RGBSPACE_BT2100_PQ;
		rec2100: typeof RGBSPACE_BT2100_PQ;
		rec2100_hlg: typeof RGBSPACE_BT2100_HLG;
	}
}
