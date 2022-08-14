/*==========================*/
/* Standard Color Gamuts    */
/*==========================*/

import { illuminants } from '../illuminants/predefined.js';
import { ColorGamut } from '../gamut.js';

// ITU-R BT.709
const COLORGAMUT_SRGB = new ColorGamut({
	id: 'srgb',
	name: 'sRGB',
	alias: ['rec709', 'bt709'],
	primaries: {
		white: { ...illuminants.d65 },
		red: { x: 0.64, y: 0.33 },
		green: { x: 0.3, y: 0.6 },
		blue: { x: 0.15, y: 0.06 },
	},
});

// SMPTE EG 432-1:2010
const COLORGAMUT_P3D65 = new ColorGamut({
	id: 'p3_d65',
	name: 'P3-D65',
	primaries: {
		white: { ...illuminants.d65 },
		red: { x: 0.68, y: 0.32 },
		green: { x: 0.265, y: 0.69 },
		blue: { x: 0.15, y: 0.06 },
	},
});

// DCI-P3 for ACES Cinema
const COLORGAMUT_P3ACES = new ColorGamut({
	id: 'p3_aces',
	name: 'P3-ACES',
	alias: ['p3-d60'],
	primaries: {
		white: { ...illuminants.aces },
		red: { x: 0.68, y: 0.32 },
		green: { x: 0.265, y: 0.69 },
		blue: { x: 0.15, y: 0.06 },
	},
});

// DCI Digital Cinema System Section 8.3.4
const COLORGAMUT_P3DCI = new ColorGamut({
	id: 'p3_dci',
	name: 'DCI-P3',
	alias: ['dci-p3'],
	primaries: {
		white: { ...illuminants.dci },
		red: { x: 0.68, y: 0.32 },
		green: { x: 0.265, y: 0.69 },
		blue: { x: 0.15, y: 0.06 },
	},
});

// Adobe RGB (1998)
const COLORGAMUT_ADOBERGB = new ColorGamut({
	id: 'adobe',
	name: 'Adobe RGB (1998)',
	alias: ['argb', 'a98'],
	primaries: {
		white: { ...illuminants.d65 },
		red: { x: 0.64, y: 0.33 },
		green: { x: 0.21, y: 0.71 },
		blue: { x: 0.15, y: 0.06 },
	},
});

// ITU-R BT.2020
const COLORGAMUT_BT2020 = new ColorGamut({
	id: 'bt2020',
	name: 'BT.2020',
	alias: ['rec2020'],
	primaries: {
		white: { ...illuminants.d65 },
		red: { x: 0.708, y: 0.292 },
		green: { x: 0.17, y: 0.797 },
		blue: { x: 0.131, y: 0.046 },
	},
});

// ACES Cinema Primaries #0
const COLORGAMUT_ACESP0 = new ColorGamut({
	id: 'aces_p0',
	name: 'ACES Primaries #0',
	primaries: {
		white: { ...illuminants.aces },
		red: { x: 0.7347, y: 0.2653 },
		green: { x: 0.0, y: 1.0 },
		blue: { x: 0.0001, y: -0.077 },
	},
});

// ACES Cinema Primaries #1
const COLORGAMUT_ACESP1 = new ColorGamut({
	id: 'aces_p1',
	name: 'ACES Prmaries #1',
	primaries: {
		white: { ...illuminants.aces },
		red: { x: 0.713, y: 0.293 },
		green: { x: 0.165, y: 0.83 },
		blue: { x: 0.128, y: 0.044 },
	},
});

// Kodak ProPhoto / ROMM RGB
const COLORGAMUT_PROPHOTO = new ColorGamut({
	id: 'prophoto',
	name: 'ProPhoto RGB',
	alias: ['romm'],
	primaries: {
		white: { ...illuminants.d50 },
		red: { x: 0.734699, y: 0.265301 },
		green: { x: 0.159597, y: 0.840403 },
		blue: { x: 0.036598, y: 0.000105 },
	},
});

declare module '../gamut' {
	interface ColorGamutNamedMap {
		srgb: typeof COLORGAMUT_SRGB;
		p3_d65: typeof COLORGAMUT_P3D65;
		p3_aces: typeof COLORGAMUT_P3ACES;
		p3_dci: typeof COLORGAMUT_P3DCI;
		bt2020: typeof COLORGAMUT_BT2020;
		adobe: typeof COLORGAMUT_ADOBERGB;
		ace_sp0: typeof COLORGAMUT_ACESP0;
		aces_p1: typeof COLORGAMUT_ACESP1;
		prophoto: typeof COLORGAMUT_PROPHOTO;
		/*
		 * Aliases
		 */
		bt709: typeof COLORGAMUT_SRGB;
		rec709: typeof COLORGAMUT_SRGB;
		p3_d60: typeof COLORGAMUT_P3ACES;
		rec2020: typeof COLORGAMUT_BT2020;
		romm: typeof COLORGAMUT_PROPHOTO;
	}
}
