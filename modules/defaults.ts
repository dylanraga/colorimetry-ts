/**
 * Defaults
 */

import { ColorSpace } from "./space";

import { XYZSpace } from "./space/xyz";
import { XYZSPACE_CIED65 } from "./space/xyz.standard";
XYZSpace.defaultSpace = XYZSPACE_CIED65;
Object.defineProperty(ColorSpace.list, "XYZ", { get: () => XYZSpace.defaultSpace });

import { LabSpace } from "./space/lab";
import { LABSPACE_CIELAB } from "./space/lab/cielab";
LabSpace.defaultSpace = LABSPACE_CIELAB;
Object.defineProperty(ColorSpace.list, "LAB", { get: () => LabSpace.defaultSpace });

import { RGBSpace } from "./space/rgb";
import { RGBSPACE_SRGB } from './space/rgb.standard';
RGBSpace.defaultSpace = RGBSPACE_SRGB;
Object.defineProperty(ColorSpace.list, "RGB", { get: () => RGBSpace.defaultSpace });

export const DEFAULT_RGBSPACE = RGBSPACE_SRGB;