/*==========================*/
/* Standard RGB ColorSpaces */
/*==========================*/

import { gamuts } from "../gamut";
import { curves } from "../trc";
import { RGBSpace } from "./rgb";

/**
 * sRGB IEC 61966-2-1:1999
 */
export const RGBSPACE_SRGB = new RGBSpace(
	gamuts.SRGB.options({ whiteLevel: 80, blackLevel: 0.2 }),
	curves.SRGB
);
RGBSPACE_SRGB.register('SRGB');
RGBSPACE_SRGB.name = "sRGB";

/**
 * Rec. 709 with BT.1886 transfer
 */
export const RGBSPACE_REC709 = new RGBSpace(
	gamuts.SRGB.options({ whiteLevel: 100 }),
	curves.BT1886
);
RGBSPACE_REC709.register(['REC709', 'BT709']);
RGBSPACE_REC709.name = 'Rec. 709';

//Display P3
export const RGBSPACE_DISPLAYP3 = new RGBSpace(
	gamuts.P3D65.options({ whiteLevel: 80, blackLevel: 0.2 }),
	curves.SRGB
);
RGBSPACE_DISPLAYP3.register(['DISPLAYP3', 'P3']);
RGBSPACE_DISPLAYP3.name = 'Display P3';
//DISPLAYP3.alias.push('P3', 'DISPLAY P3');


//DCI-P3
export const RGBSPACE_DCIP3 = new RGBSpace(
	gamuts.P3D65.options({ whiteLevel: 80 }),
	curves.GAMMA.options({ gamma: 2.6 })
);
RGBSPACE_DCIP3.register(['DCIP3', 'P3DCI']);
RGBSPACE_DCIP3.name = 'DCI-P3';
//DCIP3.alias.push('DCI-P3');

//Adobe RGB (1998) IEC 61966-2-5:2007
export const RGBSPACE_ADOBERGB = new RGBSpace(
	gamuts.ADOBERGB.options({ whiteLevel: 160, blackLevel: 0.5557}),
	curves.GAMMA.options({ gamma: 563/256 })
);
RGBSPACE_ADOBERGB.register('ADOBERGB');

//Rec2020
//Note: Rec2020 is _not_ a colorspace, but a color gamut. Define this as Rec2020 gamut with BT1886 transfer
export const RGBSPACE_REC2020 = new RGBSpace(
	gamuts.BT2020.options({ whiteLevel: 100 }),
	curves.BT1886
);
RGBSPACE_REC2020.register(['REC2020', 'BT2020']);
RGBSPACE_REC2020.name = 'Rec. 2020'

//BT2100 (PQ)
export const RGBSPACE_BT2100_PQ = new RGBSpace(
	gamuts.BT2020.options({ whiteLevel: 10000 }),
	curves.ST2084
);
RGBSPACE_BT2100_PQ.register(['BT2100', 'REC2100', 'BT2100_PQ', 'REC2100_PQ']);
RGBSPACE_BT2100_PQ.name = 'BT.2100 PQ';
//BT2100_PQ.alias.push('BT2100', 'REC2100');

//BT2100 (HLG)
export const RGBSPACE_BT2100_HLG = new RGBSpace(
	gamuts.BT2020.options({ whiteLevel: 1000 }),
	curves.HLG
);
RGBSPACE_BT2100_HLG.register(['BT2100_HLG', 'REC2100_HLG']);
RGBSPACE_BT2100_HLG.name = 'BT.2100 HLG';


declare module './rgb' {
	interface RGBSpaceNamedMap {
		SRGB: typeof RGBSPACE_SRGB,
		REC709: typeof RGBSPACE_REC709,
		DISPLAYP3: typeof RGBSPACE_DISPLAYP3,
		DCIP3: typeof RGBSPACE_DCIP3,
		REC2020: typeof RGBSPACE_REC2020,
		BT2100_PQ: typeof RGBSPACE_BT2100_PQ,
		BT2100_HLG: typeof RGBSPACE_BT2100_HLG,
		/**
		 * Aliases
		 */
		BT709: typeof RGBSPACE_REC709,
		P3: typeof RGBSPACE_DISPLAYP3,
		P3D65: typeof RGBSPACE_DISPLAYP3,
		P3DCI: typeof RGBSPACE_DCIP3,
		BT2020: typeof RGBSPACE_REC2020,
		BT2100: typeof RGBSPACE_BT2100_PQ,
		REC2100: typeof RGBSPACE_BT2100_PQ,
	}
}
