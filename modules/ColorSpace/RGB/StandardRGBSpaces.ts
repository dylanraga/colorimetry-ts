/*==========================*/
/* Standard RGB ColorSpaces */
/*==========================*/

import { gamuts } from "../../ColorGamut/StandardColorGamuts";
import { curves } from "../../ToneResponse/StandardToneResponses";
import { ColorSpace } from "../ColorSpace";
import { RGBSpace } from "./RGBSpace";

/**
 * sRGB IEC 61966-2-1:1999
 */
export const RGBSPACE_SRGB = new RGBSpace(gamuts.SRGB.whiteLevel(80).blackLevel(0.2), curves.SRGB);
RGBSPACE_SRGB.name = "sRGB";

/**
 * Rec. 709 with BT.1886 transfer
 */
export const RGBSPACE_REC709 = new RGBSpace(gamuts.SRGB.whiteLevel(100), curves.BT1886);
RGBSPACE_REC709.name = 'Rec. 709';

//Display P3
export const RGBSPACE_DISPLAYP3 = new RGBSpace(gamuts.P3D65.whiteLevel(80).blackLevel(0.2), curves.SRGB);
RGBSPACE_DISPLAYP3.name = 'Display P3';
//DISPLAYP3.alias.push('P3', 'DISPLAY P3');

//DCI-P3
export const RGBSPACE_DCIP3 = new RGBSpace(gamuts.P3D65.whiteLevel(48), curves.GAMMA.options({gamma: 2.6}));
RGBSPACE_DCIP3.name = 'DCI-P3';
//DCIP3.alias.push('DCI-P3');

//Adobe RGB (1998) IEC 61966-2-5:2007
export const RGBSPACE_ADOBERGB = new RGBSpace(gamuts.ADOBERGB.whiteLevel(160).blackLevel(0.5557), curves.GAMMA.options({gamma: 563/256}));

//Rec2020
//Note: Rec2020 is _not_ a colorspace, but a color gamut. Define this as Rec2020 gamut with BT1886 transfer
export const RGBSPACE_REC2020 = new RGBSpace(gamuts.P3D65.whiteLevel(100), curves.BT1886);
RGBSPACE_REC2020.name = 'Rec. 2020'

//BT2100 (PQ)
export const RGBSPACE_BT2100_PQ = new RGBSpace(gamuts.BT2020.whiteLevel(10000), curves.ST2084);
RGBSPACE_BT2100_PQ.name = 'BT.2100 PQ';
//BT2100_PQ.alias.push('BT2100', 'REC2100');

//BT2100 (HLG)
export const RGBSPACE_BT2100_HLG = new RGBSpace(gamuts.BT2020.whiteLevel(1000), curves.HLG);
RGBSPACE_BT2100_HLG.name = 'BT.2100 HLG';

export const rgbSpaces = {
	"SRGB": RGBSPACE_SRGB,
	"REC709": RGBSPACE_REC709,
	"DISPLAYP3": RGBSPACE_DISPLAYP3,
	"DCIP3": RGBSPACE_DCIP3,
	"REC2020": RGBSPACE_REC2020,
	"BT2100_PQ": RGBSPACE_BT2100_PQ,
	"BT2100_HLG": RGBSPACE_BT2100_HLG,
	/**
	 * Aliases
	 */
	"BT709": RGBSPACE_REC709,
	"P3": RGBSPACE_DISPLAYP3,
	"P3D65": RGBSPACE_DISPLAYP3,
	"BT2020": RGBSPACE_REC2020,
	"BT2100": RGBSPACE_BT2100_PQ,
	"REC2100": RGBSPACE_BT2100_PQ,
};

Object.assign(ColorSpace.list, rgbSpaces);