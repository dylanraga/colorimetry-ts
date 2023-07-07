// Illuminant xy coordinates
// SPD reference: Wyszecki, G., & Stiles, W. S., 1982 Color Science: concepts and methods, quantitative data and formulae (2nd ed.). New York: Wiley.

// A
// Actual: x 0.447571433445114 y 0.407440432594594
const a = {
  x: 0.4476,
  y: 0.4074,
};

// D50
// Actual: x 0.345668037029273 y 0.358496838937619
const d50 = {
  x: 0.3457,
  y: 0.3585,
};

// D55
// Actual: x 0.332424102468830 y 0.347428039087666
const d55 = {
  x: 0.3324,
  y: 0.3474,
};

// D65
// Actual: x 0.312711595379167 y 0.329008404427849
// as derived from SPD specified in `ISO 11664-2:2007`
const d65 = {
  x: 0.3127,
  y: 0.329,
};

// D75
// Actual: x 0.299022300412497 y 0.314852737888342
const d75 = {
  x: 0.299,
  y: 0.3149,
};

// D93
// Actual: x 0.283122746004607 y 0.297020246305246
const d93 = {
  x: 0.2831,
  y: 0.297,
};

// DCI
const dci = {
  x: 0.314,
  y: 0.351,
};

// ACES, aka "D60"
const aces = {
  x: 0.32168,
  y: 0.33767,
};

export const illuminants = {
  a,
  d50,
  d55,
  d65,
  d75,
  d93,
  dci,
  aces,
};
