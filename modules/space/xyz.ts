import { ColorSpace } from "../space";

interface xy { x: number, y: number }

type OBSERVER_STRINGS = 'CIE 1931 2deg' | 'CIE 1964 10deg';

class XYZSpace extends ColorSpace {
	public name: string = 'XYZ ColorSpace';
	public keys: string[] = ['X', 'Y', 'Z'];	
	public static defaultSpace: XYZSpace;
	
	constructor(illuminant: xy, observer: OBSERVER_STRINGS) {
		super();
	}

	public register(names: string[]): void;
	public register(name: string): void;
	public register(arg1: string | string[]): void {
		const strings = typeof arg1 === 'string'? [arg1] : arg1;
		
		for (const name of strings) {
			XYZSpace.named[name] = this;
		}
	}

	CAT(illuminant: xy, method: any) {

	}
}

//http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html
//TODO: add CAT

export interface XYZSpaceNamedMap { }
export type XYZSpaceName = keyof XYZSpaceNamedMap | (string & Record<never, never>);

declare module '../space' {
	interface ColorSpaceNamedMap extends XYZSpaceNamedMap {}
}

type XYZSpaceNamedMapType = XYZSpaceNamedMap & { [k: string]: XYZSpace };
export const xyzSpaces = XYZSpace.named as XYZSpaceNamedMapType;

export { XYZSpace };