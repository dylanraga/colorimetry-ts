/*==========================*/
/* Standard Color Gamuts    */
/*==========================*/

import { illuminants } from "./illuminants";
import { ColorGamut, gamuts } from "./gamut";

const COLORGAMUT_SRGB = new ColorGamut({
	white: 	{...illuminants.D65, Y: 1},
	red: 		{x: 0.6400, y: 0.3300},
	green: 	{x: 0.3000, y: 0.6000},
	blue: 	{x: 0.1500, y: 0.0600}
});
COLORGAMUT_SRGB.register(['SRGB', 'REC709', 'BT709']);

const COLORGAMUT_P3D65 = new ColorGamut({
	white: 	{...illuminants.D65, Y: 1},
	red: 		{x: 0.6800, y: 0.3200},
	green: 	{x: 0.2650, y: 0.6900},
	blue: 	{x: 0.1500, y: 0.0600}
});
COLORGAMUT_P3D65.register(['P3D65', 'DISPLAYP3']);

const COLORGAMUT_ADOBERGB = new ColorGamut({
	white: 	{...illuminants.D65, Y: 1},
	red: 		{x: 0.6400, y: 0.3300},
	green: 	{x: 0.2100, y: 0.7100},
	blue: 	{x: 0.1500, y: 0.0600}
});
COLORGAMUT_ADOBERGB.register('ADOBERGB');

const COLORGAMUT_BT2020 = new ColorGamut({
	white: 	{...illuminants.D65, Y: 1},
	red: 		{x: 0.7080, y: 0.2920},
	green: 	{x: 0.1700, y: 0.7970},
	blue: 	{x: 0.1310, y: 0.0460}
});
COLORGAMUT_BT2020.register(['BT2020', 'REC2020']);


declare module './gamut' {
	interface ColorGamutNamedMap {
		SRGB: typeof COLORGAMUT_SRGB,
		P3D65: typeof COLORGAMUT_P3D65,
		BT2020: typeof COLORGAMUT_BT2020,
		ADOBERGB: typeof COLORGAMUT_ADOBERGB,
		/*
		* Aliases
		*/
		BT709: typeof COLORGAMUT_SRGB,
		REC709: typeof COLORGAMUT_SRGB,
		DISPLAYP3: typeof COLORGAMUT_P3D65,
		REC2020: typeof COLORGAMUT_BT2020
	}
}