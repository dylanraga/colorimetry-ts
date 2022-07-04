import { ColorSpace } from "../ColorSpace";

class LChSpace extends ColorSpace {
	public name: string = 'LCh ColorSpace';
	constructor() {
		super(['L', 'C', 'h']);
	}

	toLab() {
		
	}
}