import { illuminants } from "../../Illuminants/Illuminants";
import { ColorSpace } from "../ColorSpace";
import { XYZSpace } from "./XYZSpace";

const CIEXYZ_2deg = new XYZSpace(illuminants.D65, 'CIE 1931 2deg');

export const xyzSpaces = {
	"CIE1931_2deg": CIEXYZ_2deg
}

Object.assign(ColorSpace.list, xyzSpaces);