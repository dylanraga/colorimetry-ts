import { ColorSpace } from "../space";

class LChSpace extends ColorSpace {
	public name: string = 'LCh ColorSpace';
	public keys: string[] = ['L', 'C', 'h'];
	constructor() {
		super();
	}

	/**
	 * Converts a LChSpace mapping to an LabSpace mapping
	 */
	toLab() {
		
	}
}