import { deg2rad, rad2deg } from "../common/util";
import { ColorSpace } from "../space";
import { LCHSpace } from "./lch";

class LabSpace extends ColorSpace {
	public name: string = 'Lab ColorSpace';
	public keys: string[] = ['L', 'a', 'b'];
	constructor(
	) {
		super();
	}

	/**
	 * Returns the cylindrical LCh form of the current Lab space
	 */
	public toLCH() {
		const lchSpace = new LCHSpace();
		lchSpace.name = this.name + ' (LCH)';
		lchSpace.addConversion(this,
			([L, C, h]) => [L, C*Math.cos(deg2rad(h)), C*Math.sin(deg2rad(h))],
			([L, a, b]) => [L, (a*a + b*b)**(1/2), rad2deg(Math.atan2(b, a))]
		);
		return lchSpace;
	}

	public register(nameList: string[]): void;
	public register(name: string): void;
	public register(arg1: string | string[]): void {
		const strings = typeof arg1 === 'string'? [arg1] : arg1;
		
		super.register(strings);
		for (const name of strings) {
			LabSpace.named[name] = this;
		}
	}
}



export interface LabSpaceNamedMap { }
export type LabSpaceName = keyof LabSpaceNamedMap | (string & Record<never, never>);

declare module '../space' {
	interface ColorSpaceNamedMap extends LabSpaceNamedMap {}
}

type LabSpaceNamedMapType = LabSpaceNamedMap & { [k: string]: LabSpace };
export const labSpaces = LabSpace.named as LabSpaceNamedMapType;

export { LabSpace };