import { deg2rad, rad2deg } from "../common/util";
import { ColorSpace } from "../space";
import { LabSpace } from "./lab";

class LCHSpace extends ColorSpace {
	public name: string = 'LCH ColorSpace';
	public keys: string[] = ['L', 'C', 'H'];
	constructor() {
		super();
	}

	/**
	 * Returns the cartesion Lab form of the current LCH space
	 */
	toLab() {
		const labSpace = new LabSpace();
		labSpace.addConversion(this,
			([L, a, b]) => [L, (a*a + b*b)**(1/2), rad2deg(Math.atan2(b,a))],
			([L, C, h]) => [L, C*Math.cos(deg2rad(h)), C*Math.sin(deg2rad(h))]
		);
		return labSpace;
	}
}


export { LCHSpace }