// Illuminant xy coordinates
// SPD reference: Wyszecki, G., & Stiles, W. S., 1982 Color Science: concepts and methods, quantitative data and formulae (2nd ed.). New York: Wiley.

import { xy } from "../space/chromaticity/xy.js";

// A
// Actual: x 0.447571433445114 y 0.407440432594594
export const a: xy = {
  x: 0.44757,
  y: 0.40744,
};

// D50
// Actual: x 0.345668037029273 y 0.358496838937619
export const d50: xy = {
  x: 0.34567,
  y: 0.3585,
};

// D55
// Actual: x 0.332424102468830 y 0.347428039087666
export const d55: xy = {
  x: 0.33242,
  y: 0.34743,
};

// D65
// Actual: x 0.312711595379167 y 0.329008404427849
// as derived from SPD specified in `ISO 11664-2:2007`
export const d65: xy = {
  x: 0.312711595379167,
  y: 0.329008404427849,
};

// D75
// Actual: x 0.299022300412497 y 0.314852737888342
export const d75: xy = {
  x: 0.29902,
  y: 0.31485,
};

// D93
// Actual: x 0.283122746004607 y 0.297020246305246
export const d93: xy = {
  x: 0.28312,
  y: 0.29702,
};

// DCI
export const dci: xy = {
  x: 0.314,
  y: 0.351,
};

// ACES, aka "D60"
export const aces: xy = {
  x: 0.32168,
  y: 0.33767,
};
