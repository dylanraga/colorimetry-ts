/*=================*/
/* Color Structure */
/*=================*/
import { ColorSpace, ColorSpaceName } from './space.js';

export interface ColorConstructor {
	/**
	 * Creates a new `Color` instance
	 * @param space Data color space of the input values as a `ColorSpace` object or as a `string` name of a registered `ColorSpace`
	 * @param values Values of the desired color in terms of `space`
	 * @param props Optional properties to apply to the `ColorSpace`
	 */
	new (
		space: ColorSpace | ColorSpaceName,
		values: number[],
		//props?: Partial<ColorSpaceTypeProps<S>>
		props?: Record<string, unknown>
	): Color;
	readonly prototype: Color;
}

export class Color {
	public space: ColorSpace;
	public values: number[];

	constructor(
		space: ColorSpace | ColorSpaceName,
		values: number[]
		//props?: Partial<ColorSpaceTypeProps<S>>
	) {
		this.space = typeof space === 'string' ? ColorSpace.getSpaceById(space) : space;
		this.values = values;
	}

	/**
	 * Returns color data values in the desired color space
	 * @param toSpace Output color space as a `ColorSpace` object or as a `string` name of a registered `ColorSpace`
	 * @param props Optional properties to apply to the `ColorSpace`
	 */
	public get<T extends ColorSpace | ColorSpaceName>(toSpace: T, convertingProps?: Record<string, unknown>) {
		const _toSpace = typeof toSpace === 'string' ? ColorSpace.getSpaceById(toSpace) : (toSpace as ColorSpace);

		if (this.space === _toSpace) return this.values;

		const conversion = this.space.getConversionBySpace(_toSpace);
		const newValues = conversion(this.values, {
			...convertingProps,
		});

		return newValues;
	}
}
