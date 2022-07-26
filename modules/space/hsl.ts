import { ColorSpace } from "../space.js";

class HSLSpace extends ColorSpace {
	public name: string = 'HSL ColorSpace';
	public keys: string[] = ['h', 's', 'l'];
	constructor() {
		super();
	}

}

export { HSLSpace };