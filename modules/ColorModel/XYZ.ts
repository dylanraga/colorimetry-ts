import ColorModel from "../ColorModel.js";
import ColorSpace from "../ColorSpace.js";

ColorModel.types.XYZ = new ColorModel('XYZ', ['X', 'Y', 'Z']);

const CIEXYZ = new ColorSpace(ColorModel.types.XYZ, []);
CIEXYZ.name = 'CIEXYZ';

ColorModel.types.XYZ.spaces.CIEXYZ = CIEXYZ;
ColorModel.types.XYZ.defaultSpace = CIEXYZ;

//TODO: add CAT