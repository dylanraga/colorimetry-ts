import { ColorSpace, ColorSpaceConstructorProps, spaces } from '../space.js';
import { Lab_to_LCh, LChSpace, LCh_to_Lab } from './lch.js';

export class LabSpace extends ColorSpace {
	constructor({ name = 'Lab ColorSpace', keys = ['L', 'a', 'b'], ...props }: ColorSpaceConstructorProps) {
		super({ name, keys, ...props });
	}

	/**
	 * Returns the cylindrical LCh form of the current Lab space
	 */
	public toLCh() {
		const lchId = this.id ? `${this.id}_lch` : undefined;
		let lchSpace = lchId ? spaces[lchId] : undefined;

		if (!lchSpace) {
			lchSpace = new LChSpace({
				id: lchId,
				name: `LCh ColorSpace (${this.name})`,
				conversions: [
					{
						space: this,
						toFn: LCh_to_Lab,
						fromFn: Lab_to_LCh,
					},
				],
			});
		}

		return lchSpace;
	}

	/**
	 * Static
	 */
	public static named = {} as LabSpaceNamedMap & Record<string, LabSpace>;
}

export interface LabSpaceNamedMap {}
export type LabSpaceName = keyof LabSpaceNamedMap | (string & Record<never, never>);

declare module '../space' {
	interface ColorSpaceNamedMap extends LabSpaceNamedMap {}
}

export const labSpaces = LabSpace.named;
