import { ColorSpace, ColorSpaceConversion } from "../ColorSpace";

class LabSpace extends ColorSpace {
	public name: string = 'Lab ColorSpace';
	constructor(
		public keys: string[]
	) {
		super(['L', 'a', 'b']);
	}

	toLCh() {

	}
}

import { LABSPACE_CIELAB } from "./CIELab";
LabSpace.defaultSpace = LABSPACE_CIELAB;
Object.defineProperty(ColorSpace.list, "LAB", { get: () => LabSpace.defaultSpace });


export { LabSpace };