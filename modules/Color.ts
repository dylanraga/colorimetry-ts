/*=================*/
/* Color Structure */
/*=================*/
import { ColorSpace, ColorSpaceName } from './space';

interface ColorConstructor {
	new (space: ColorSpace | string, data: number[]): Color;
	readonly prototype: Color;
}

interface Color {
	space: ColorSpace | string;
	values: number[];
	get: (toSpace: ColorSpace | string, options?: {}) => number[];
}

const Color = class Color<T> {
	public space: ColorSpace;
	public values: number[]

	constructor(space: ColorSpace | ColorSpaceName, data: number[] ) {
		if (typeof space === 'string')
			space = ColorSpace.getSpaceByName(space);
		
		this.space = space;
		this.values = data;
	}

	public get(toSpace: ColorSpace | ColorSpaceName, options = {}) {
		const fromSpace = this.space;
		let currData = this.values;
		if (fromSpace === toSpace) return currData;

		if (typeof toSpace === 'string') {
			toSpace = ColorSpace.getSpaceByName(toSpace);
		}

		const conversion = fromSpace.getConversionBySpace(toSpace)!;
		const newData = conversion(currData, options);
		
		return newData;
	}
	
} as ColorConstructor;

export { Color, ColorConstructor };