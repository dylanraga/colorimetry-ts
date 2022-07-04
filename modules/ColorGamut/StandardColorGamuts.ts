/*==========================*/
/* Standard Color Gamuts    */
/*==========================*/

import { illuminants } from "../Illuminants/Illuminants";
import { ColorGamut } from "./ColorGamut";

const COLORGAMUT_SRGB = new ColorGamut({
	white: 	{...illuminants.D65, Y: 1},
	red: 		{x: 0.6400, y: 0.3300},
	green: 	{x: 0.3000, y: 0.6000},
	blue: 	{x: 0.1500, y: 0.0600}
});

const COLORGAMUT_P3D65 = new ColorGamut({
	white: 	{...illuminants.D65, Y: 1},
	red: 		{x: 0.6800, y: 0.3200},
	green: 	{x: 0.2650, y: 0.6900},
	blue: 	{x: 0.1500, y: 0.0600}
});

const COLORGAMUT_ADOBERGB = new ColorGamut({
	white: 	{...illuminants.D65, Y: 1},
	red: 		{x: 0.6400, y: 0.3300},
	green: 	{x: 0.2100, y: 0.7100},
	blue: 	{x: 0.1500, y: 0.0600}
});

const COLORGAMUT_BT2020 = new ColorGamut({
	white: 	{...illuminants.D65, Y: 1},
	red: 		{x: 0.7080, y: 0.2920},
	green: 	{x: 0.1700, y: 0.7970},
	blue: 	{x: 0.1310, y: 0.0460}
});

export const gamuts = {
	"SRGB": COLORGAMUT_SRGB,
	"P3D65": COLORGAMUT_P3D65,
	"BT2020": COLORGAMUT_BT2020,
	"ADOBERGB": COLORGAMUT_ADOBERGB,
	/*
	 * Aliases
	 */
	"BT709": COLORGAMUT_SRGB,
	"REC709": COLORGAMUT_SRGB,
	"DISPLAYP3": COLORGAMUT_P3D65,
	"REC2020": COLORGAMUT_BT2020
}