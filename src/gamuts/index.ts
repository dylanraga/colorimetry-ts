import { illuminants } from "../illuminants/index.js";
import { type xy } from "../spaces/xy.js";

export interface ColorGamutPrimaries {
  readonly id?: string;
  readonly name?: string;
  readonly alias?: string[];
  readonly white: xy;
  readonly red: xy;
  readonly green: xy;
  readonly blue: xy;
  readonly black?: xy;
}

// ITU-R BT.709
const srgb: ColorGamutPrimaries = {
  id: "srgb",
  name: "sRGB",
  alias: ["rec709", "bt709"],
  white: { ...illuminants.d65 },
  red: { x: 0.64, y: 0.33 },
  green: { x: 0.3, y: 0.6 },
  blue: { x: 0.15, y: 0.06 },
};

// ITU-R BT.601
const bt601: ColorGamutPrimaries = {
  id: "bt601",
  name: "BT.601",
  white: { ...illuminants.d65 },
  red: { x: 0.63, y: 0.34 },
  green: { x: 0.31, y: 0.595 },
  blue: { x: 0.155, y: 0.07 },
};

// SMPTE EG 432-1:2010
const p3_d65: ColorGamutPrimaries = {
  id: "p3-d65",
  name: "P3-D65",
  white: { ...illuminants.d65 },
  red: { x: 0.68, y: 0.32 },
  green: { x: 0.265, y: 0.69 },
  blue: { x: 0.15, y: 0.06 },
};

// DCI-P3 for ACES Cinema
const p3_aces: ColorGamutPrimaries = {
  id: "p3-aces",
  name: "P3-ACES",
  alias: ["p3-d60"],
  white: { ...illuminants.aces },
  red: { x: 0.68, y: 0.32 },
  green: { x: 0.265, y: 0.69 },
  blue: { x: 0.15, y: 0.06 },
};

// DCI Digital Cinema System Section 8.3.4
const p3_dci: ColorGamutPrimaries = {
  id: "p3-dci",
  name: "DCI-P3",
  alias: ["dci-p3"],
  white: { ...illuminants.dci },
  red: { x: 0.68, y: 0.32 },
  green: { x: 0.265, y: 0.69 },
  blue: { x: 0.15, y: 0.06 },
};

// Adobe RGB (1998)
const adobergb: ColorGamutPrimaries = {
  id: "adobe",
  name: "Adobe RGB (1998)",
  alias: ["argb", "a98"],
  white: { ...illuminants.d65 },
  red: { x: 0.64, y: 0.33 },
  green: { x: 0.21, y: 0.71 },
  blue: { x: 0.15, y: 0.06 },
};

// ITU-R BT.2020
const bt2020: ColorGamutPrimaries = {
  id: "bt2020",
  name: "BT.2020",
  alias: ["rec2020"],
  white: { ...illuminants.d65 },
  red: { x: 0.708, y: 0.292 },
  green: { x: 0.17, y: 0.797 },
  blue: { x: 0.131, y: 0.046 },
};

// ACES Cinema Primaries #0
const acesp0: ColorGamutPrimaries = {
  id: "aces-p0",
  name: "ACES Primaries #0",
  white: { ...illuminants.aces },
  red: { x: 0.7347, y: 0.2653 },
  green: { x: 0.0, y: 1.0 },
  blue: { x: 0.0001, y: -0.077 },
};

// ACES Cinema Primaries #1
const acesp1: ColorGamutPrimaries = {
  id: "aces-p1",
  name: "ACES Prmaries #1",
  white: { ...illuminants.aces },
  red: { x: 0.713, y: 0.293 },
  green: { x: 0.165, y: 0.83 },
  blue: { x: 0.128, y: 0.044 },
};

// Kodak ProPhoto / ROMM RGB
const prophoto: ColorGamutPrimaries = {
  id: "prophoto",
  name: "ProPhoto RGB",
  white: { ...illuminants.d50 },
  red: { x: 0.734699, y: 0.265301 },
  green: { x: 0.159597, y: 0.840403 },
  blue: { x: 0.036598, y: 0.000105 },
};

export const gamuts = { srgb, bt601, p3_d65, p3_aces, p3_dci, adobergb, bt2020, acesp0, acesp1, prophoto };
