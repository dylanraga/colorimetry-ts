import { ColorSpace, ColorSpaceConstructorProps } from '../space.js';

export class HSLSpace extends ColorSpace {
	constructor({ name = 'HSL ColorSpace', keys = ['H', 'S', 'L'], ...props }: ColorSpaceConstructorProps) {
		super({ name, keys, ...props });
	}

	/**
	 * Static
	 */
	//public static named = {} as HSLSpaceSpaceNamedMap & Record<string, HSLSpace>;
}
