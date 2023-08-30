import { linearRgbSpace, rgbSpace } from "../rgb.js";
import { gamuts } from "../../gamuts/index.js";
import { curves, gammaCurve } from "../../curves/index.js";

export const srgb_linear = linearRgbSpace({
  name: "sRGB Linear",
  gamut: gamuts.srgb,
});

export const p3_d65_linear = linearRgbSpace({
  name: "P3-D65 Linear",
  gamut: gamuts.p3_d65,
});

export const bt2020_linear = linearRgbSpace({
  name: "BT.2020 Linear",
  gamut: gamuts.bt2020,
});

// The pseudo-standard color space for computers/the web
export const rgb = rgbSpace({
  name: "Computer RGB",
  gamut: gamuts.srgb,
  curve: curves.gamma2p2,
  whiteLuminance: 100,
  blackLuminance: 0,
});

// sRGB IEC 61966-2-1:1999
export const srgb = rgbSpace({
  name: "sRGB",
  gamut: gamuts.srgb,
  curve: curves.srgb,
  whiteLuminance: 80,
  blackLuminance: 0.2,
});

// Rec. 709 with BT.1886 transfer
export const rec709 = rgbSpace({
  name: "Rec. 709",
  gamut: gamuts.srgb,
  curve: curves.bt1886,
  whiteLuminance: 100,
  blackLuminance: 0,
});

// Apple Inc. Display P3
export const display_p3 = rgbSpace({
  name: "Display P3",
  gamut: gamuts.p3_d65,
  curve: curves.srgb,
  whiteLuminance: 80,
  blackLuminance: 0.2,
});

// Digital Cinema Initiative P3
export const p3_dci = rgbSpace({
  name: "DCI-P3",
  gamut: gamuts.p3_dci,
  curve: curves.gamma2p6,
  whiteLuminance: 48,
  blackLuminance: 0.005,
});

// Digital Cinema Initiative P3 with D65
export const p3_d65 = rgbSpace({
  name: "Display P3",
  gamut: gamuts.p3_d65,
  curve: curves.gamma2p2,
  whiteLuminance: 100,
  blackLuminance: 0,
});

// Adobe RGB (1998) IEC 61966-2-5:2007
export const adobergb = rgbSpace({
  name: "Adobe RGB 1998",
  gamut: gamuts.a98rgb,
  curve: gammaCurve(563 / 256),
  whiteLuminance: 160,
  blackLuminance: 0.5557,
});

// BT.2020 gamut with BT.1886 transfer
export const rec2020 = rgbSpace({
  name: "Rec. 2020",
  gamut: gamuts.bt2020,
  curve: curves.bt1886,
  whiteLuminance: 100,
  blackLuminance: 0,
});

// BT.2100: BT.2020 with ST.2084 transfer
export const bt2100_pq = rgbSpace({
  name: "BT.2100 PQ",
  gamut: gamuts.bt2020,
  curve: curves.st2084,
  peakLuminance: 10000,
  whiteLuminance: curves.st2084.eotf(0.58),
  blackLuminance: 0.0001,
});

// BT.2100: BT.2020 with HLG transfer
export const bt2100_hlg = rgbSpace({
  name: "BT.2100 HLG",
  gamut: gamuts.bt2020,
  curve: curves.hlg,
  peakLuminance: 1000,
  whiteLuminance: curves.hlg.eotf(0.75),
  blackLuminance: 0,
});

// Kodak ProPhoto RGB
export const prophoto = rgbSpace({
  name: "ProPhoto RGB",
  gamut: gamuts.prophoto,
  curve: curves.romm,
  whiteLuminance: 160,
  blackLuminance: 0.1,
});

// ACEScg
export const acescg = linearRgbSpace({
  name: "ACEScg",
  gamut: gamuts.acesp1,
});

// ACEScc
export const acescc = rgbSpace({
  name: "ACEScc",
  gamut: gamuts.acesp1,
  curve: curves.acescc,
  whiteLuminance: 100,
  blackLuminance: 0,
});
