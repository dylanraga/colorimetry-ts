import { ColorSpace } from "../ColorSpace.js";

class HSLSpace extends ColorSpace {
	public name: string = 'HSL ColorSpace';
	constructor() {
		super(['h', 's', 'l']);
	}

}

export { HSLSpace };