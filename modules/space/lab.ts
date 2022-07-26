import { ColorSpace } from "../space";

class LabSpace extends ColorSpace {
	public name: string = 'Lab ColorSpace';
	public keys: string[] = ['L', 'a', 'b'];
	constructor(
	) {
		super();
	}

	toLCh() {

	}
}


export { LabSpace };