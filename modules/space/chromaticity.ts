import { ColorSpace, ColorSpaceConstructorProps } from '../space.js';

export class ChromaticitySpace extends ColorSpace {
	constructor({ name = 'Chromaticity ColorSpace', keys = ['a', 'b'], ...props }: ColorSpaceConstructorProps) {
		super({ name, keys, ...props });
	}

	/**
	 * Static
	 */
	public static named = {} as ChromaticitySpaceNamedMap & Record<string, ChromaticitySpace>;
}

export interface ChromaticitySpaceNamedMap {}
export type ChromaticitySpaceName = keyof ChromaticitySpaceNamedMap | (string & Record<never, never>);

declare module '../space' {
	interface ColorSpaceNamedMap extends ChromaticitySpaceNamedMap {}
}

export const chromaticitySpaces = ChromaticitySpace.named;
