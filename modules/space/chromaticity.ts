import { ColorSpace } from "../space";

class ChromaticitySpace extends ColorSpace {
	public name: string = 'Chromaticity ColorSpace';
	public key: string[] = ['a', 'b'];

	constructor() {
		super();
	}

	public register(nameList: string[]): void;
	public register(name: string): void;
	public register(arg1: string | string[]): void {
		const strings = typeof arg1 === 'string'? [arg1] : arg1;
		
		super.register(strings);
		for (const name of strings) {
			ChromaticitySpace.named[name] = this;
		}
	}
}


export interface ChromaticitySpaceNamedMap { }
export type ChromaticitySpaceName = keyof ChromaticitySpaceNamedMap | (string & Record<never, never>);

declare module '../space' {
	interface ColorSpaceNamedMap extends ChromaticitySpaceNamedMap {}
}

type ChromaticitySpaceNamedMapType = ChromaticitySpaceNamedMap & { [k: string]: ChromaticitySpace };
export const chromaticitySpaces = ChromaticitySpace.named as ChromaticitySpaceNamedMapType;

export { ChromaticitySpace };