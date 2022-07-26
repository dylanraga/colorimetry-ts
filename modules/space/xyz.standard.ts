import { illuminants } from "../illuminants";
import { ColorSpace } from "../space";
import { XYZSpace } from "./xyz";

export const XYZSPACE_CIED65 = new XYZSpace(illuminants.D65, 'CIE 1931 2deg');

export const xyzSpaces = {
	"CIE1931_2deg": XYZSPACE_CIED65
}

Object.assign(ColorSpace.list, xyzSpaces);