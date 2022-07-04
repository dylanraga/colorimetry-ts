import { ColorSpace } from "../ColorSpace";

interface xy { x: number, y: number }

type OBSERVER_STRINGS = 'CIE 1931 2deg' | 'CIE 1964 10deg';

class XYZSpace extends ColorSpace {
	public name: string = 'XYZ ColorSpace';
	constructor(illuminant: xy, observer: OBSERVER_STRINGS) {
		super(['X', 'Y', 'Z']);
	}

	CAT(illuminant: xy, method: any) {

	}
}

//http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html
//TODO: add CAT


import { xyzSpaces } from "./StandardXYZSpaces";
XYZSpace.defaultSpace = xyzSpaces["CIE1931_2deg"];
Object.defineProperty(ColorSpace.list, "XYZ", { get: () => XYZSpace.defaultSpace });


export { XYZSpace };