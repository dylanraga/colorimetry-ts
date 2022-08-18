// Illuminant xy coordinates
// SPD reference: Wyszecki, G., & Stiles, W. S., 1982 Color Science: concepts and methods, quantitative data and formulae (2nd ed.). New York: Wiley.

import { xy } from '../space/chromaticity/xy.js';

// A
// Actual: x 0.447571433445114 y 0.407440432594594
export const ILLUMINANT_A: xy = {
	x: 0.44757,
	y: 0.40744,
};

// D50
// Actual: x 0.345668037029273 y 0.358496838937619
export const ILLUMINANT_D50: xy = {
	x: 0.34567,
	y: 0.3585,
};

// D55
// Actual: x 0.332424102468830 y 0.347428039087666
export const ILLUMINANT_D55: xy = {
	x: 0.33242,
	y: 0.34743,
};

// D65
// Actual: x 0.312711595379167 y 0.329008404427849
// as derived from SPD specified in `ISO 11664-2:2007`
export const ILLUMINANT_D65: xy = {
	x: 0.312711595379167,
	y: 0.329008404427849,
};

// D75
// Actual: x 0.299022300412497 y 0.314852737888342
export const ILLUMINANT_D75: xy = {
	x: 0.29902,
	y: 0.31485,
};

// D93
// Actual: x 0.283122746004607 y 0.297020246305246
export const ILLUMINANT_D93: xy = {
	x: 0.28312,
	y: 0.29702,
};

// DCI
export const ILLUMINANT_DCI: xy = {
	x: 0.314,
	y: 0.351,
};

// ACES, aka "D60"
export const ILLUMINANT_ACES: xy = {
	x: 0.32168,
	y: 0.33767,
};

export const illuminants = {
	a: ILLUMINANT_A,
	d50: ILLUMINANT_D50,
	d55: ILLUMINANT_D55,
	d65: ILLUMINANT_D65,
	d75: ILLUMINANT_D75,
	d93: ILLUMINANT_D93,
	dci: ILLUMINANT_DCI,
	aces: ILLUMINANT_ACES,
	d60: ILLUMINANT_ACES,
};
