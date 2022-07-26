import { ColorSpace } from "../space";

interface xy { x: number, y: number }

type OBSERVER_STRINGS = 'CIE 1931 2deg' | 'CIE 1964 10deg';

class XYZSpace extends ColorSpace {
	public name: string = 'XYZ ColorSpace';
	public keys: string[] = ['X', 'Y', 'Z'];
	
	constructor(illuminant: xy, observer: OBSERVER_STRINGS) {
		super();
	}

	CAT(illuminant: xy, method: any) {

	}
}

//http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html
//TODO: add CAT

export { XYZSpace };