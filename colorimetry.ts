/*====================*/
/* Author: Dylan Raga */
/*====================*/

import { ColorGamutPrimaries } from "./src/gamut.js";
export { ColorGamutPrimaries };

import * as gamuts from "./src/gamuts/index.js";
export { gamuts };

import { ToneResponseCurve } from "./src/curves.js";
export { ToneResponseCurve };

import * as curves from "./src/curves/index.js";
export { curves };

import * as illuminants from "./src/illuminants/index.js";
export { illuminants };

import { ColorSpace } from "./src/space.js";
export { ColorSpace };

import * as spaces from "./src/spaces/index.js";
export { spaces };

// import { xyzCat } from "./src/cat.js";
// export { xyzCat };

// import { XYZSpace, xyzSpaces } from "./src/spaces/xyz.ts";
// import "./src/spaces/xyz/predefined.js";
// export { XYZSpace, xyzSpaces };

// import { RGBLinearSpace, rgbLinearSpaces } from "./src/spaces/rgb-linear.js";
// import "./src/spaces/rgb-linear/predefined.js";
// export { RGBLinearSpace, rgbLinearSpaces };

// import { RGBEncodedSpace, rgbSpaces } from "./src/spaces/rgb-encoded.js";
// import "./src/spaces/rgb-encoded/predefined.js";
// export { RGBEncodedSpace, rgbSpaces };

// import { ChromaticitySpace } from "./src/spaces/chromaticity.js";
// import * as chromaticitySpaces from "./src/spaces/chromaticity/predefined.js";
// export { ChromaticitySpace, chromaticitySpaces };

// import { LabSpace, labSpaces } from "./src/spaces/lab.js";
// import "./src/spaces/lab/predefined.js";
// export { LabSpace, labSpaces };

import { Color, color } from "./src/color.js";
import * as diffs from "./src/diffs/index.js";
export { diffs };
import { colorDiff } from "./src/diff.js";
import "./src/color/luminance.js";
// import "./src/color/luma.js";
import "./src/color/cct.js";
import "./src/color/clamp-gamut.js";
import "./src/color/cat.js";
export { Color, color, colorDiff };

//import * as cctData from './src/common/locus_10nm.json';
import { cctData } from "./src/misc/locus_10nm.js";
export { cctData };

import { daylightLocusData } from "./src/misc/daylightlocus_10nm.js";
export { daylightLocusData };

import { cmfs1931Data } from "./src/misc/cmfs-cie1931xyz-2deg.js";
export { cmfs1931Data };

import "./src/defaults.js";

export { mmult3331, mmult3333, minv, mmult, quantizeToBits, roundHTE } from "./src/common/util.js";
