import { ColorSpace } from "../space";

export class ChromaticitySpace extends ColorSpace {
	public name: string = 'Chromaticity ColorSpace';
	public key: string[] = ['a', 'b'];

	constructor() {
		super();
	}
}