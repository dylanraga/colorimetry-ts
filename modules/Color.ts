/*=================*/
/* Color Structure */
/*=================*/
import { ColorSpace, ColorSpaceName } from './space';

interface ColorConstructor {
	new (space: ColorSpace | ColorSpaceName, values: number[]): Color;
	readonly prototype: Color;
}

interface Color {
	space: ColorSpace;
	values: number[];
	get: (toSpace: ColorSpace | ColorSpaceName, options?: {}) => number[];
}

const Color = class Color {
	public space: ColorSpace;
	public values: number[]

	constructor(space: ColorSpace | string, values: number[] ) {
		if (typeof space === 'string')
			space = ColorSpace.getSpaceByName(space);
		
		this.space = space;
		this.values = values;
	}

	public get(toSpace: ColorSpace | string, options = {}) {
		const fromSpace = this.space;
		let currData = this.values;
		if (fromSpace === toSpace) return currData;

		if (typeof toSpace === 'string') {
			toSpace = ColorSpace.getSpaceByName(toSpace);
		}

		const conversion = fromSpace.getConversionBySpace(toSpace);
		const newValues = conversion(currData, options);
		
		return newValues;
	}
	
} as ColorConstructor;

export { Color, ColorConstructor };