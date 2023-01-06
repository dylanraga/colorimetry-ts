/*==========================*/
/* Standard Color Gamuts    */
/*==========================*/
import * as illuminants from "../illuminant/predefined.js";
import { ColorGamutPrimaries } from "./gamut.js";

// ITU-R BT.709
export const srgb: ColorGamutPrimaries = {
  id: "srgb",
  name: "sRGB",
  alias: ["rec709", "bt709"],
  white: { ...illuminants.d65 },
  red: { x: 0.64, y: 0.33 },
  green: { x: 0.3, y: 0.6 },
  blue: { x: 0.15, y: 0.06 },
};

// SMPTE EG 432-1:2010
export const p3d65: ColorGamutPrimaries = {
  id: "p3-d65",
  name: "P3-D65",
  white: { ...illuminants.d65 },
  red: { x: 0.68, y: 0.32 },
  green: { x: 0.265, y: 0.69 },
  blue: { x: 0.15, y: 0.06 },
};

// DCI-P3 for ACES Cinema
export const p3aces: ColorGamutPrimaries = {
  id: "p3-aces",
  name: "P3-ACES",
  alias: ["p3-d60"],
  white: { ...illuminants.aces },
  red: { x: 0.68, y: 0.32 },
  green: { x: 0.265, y: 0.69 },
  blue: { x: 0.15, y: 0.06 },
};

// DCI Digital Cinema System Section 8.3.4
export const p3dci: ColorGamutPrimaries = {
  id: "p3-dci",
  name: "DCI-P3",
  alias: ["dci-p3"],
  white: { ...illuminants.dci },
  red: { x: 0.68, y: 0.32 },
  green: { x: 0.265, y: 0.69 },
  blue: { x: 0.15, y: 0.06 },
};

// Adobe RGB (1998)
export const adobergb: ColorGamutPrimaries = {
  id: "adobe",
  name: "Adobe RGB (1998)",
  alias: ["argb", "a98"],
  white: { ...illuminants.d65 },
  red: { x: 0.64, y: 0.33 },
  green: { x: 0.21, y: 0.71 },
  blue: { x: 0.15, y: 0.06 },
};

// ITU-R BT.2020
export const bt2020: ColorGamutPrimaries = {
  id: "bt2020",
  name: "BT.2020",
  alias: ["rec2020"],
  white: { ...illuminants.d65 },
  red: { x: 0.708, y: 0.292 },
  green: { x: 0.17, y: 0.797 },
  blue: { x: 0.131, y: 0.046 },
};

// ACES Cinema Primaries #0
export const acesp0: ColorGamutPrimaries = {
  id: "aces-p0",
  name: "ACES Primaries #0",
  white: { ...illuminants.aces },
  red: { x: 0.7347, y: 0.2653 },
  green: { x: 0.0, y: 1.0 },
  blue: { x: 0.0001, y: -0.077 },
};

// ACES Cinema Primaries #1
export const acesp1: ColorGamutPrimaries = {
  id: "aces-p1",
  name: "ACES Prmaries #1",
  white: { ...illuminants.aces },
  red: { x: 0.713, y: 0.293 },
  green: { x: 0.165, y: 0.83 },
  blue: { x: 0.128, y: 0.044 },
};

// Kodak ProPhoto / ROMM RGB
export const prophoto: ColorGamutPrimaries = {
  id: "prophoto",
  name: "ProPhoto RGB",
  alias: ["romm"],
  white: { ...illuminants.d50 },
  red: { x: 0.734699, y: 0.265301 },
  green: { x: 0.159597, y: 0.840403 },
  blue: { x: 0.036598, y: 0.000105 },
};
