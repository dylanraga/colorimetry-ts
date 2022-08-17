import { bfsPath } from './common/util.js';
import { Registerable, RegisterableConstructorProps } from './registerable.js';

export interface ColorSpaceConstructorProps extends RegisterableConstructorProps {
	keys?: string[];
	conversions?: ColorSpaceConversion[];
	convertingProps?: ColorSpaceConvertingProps;
	precision?: number;
}

export abstract class ColorSpace extends Registerable {
	public readonly keys: string[];
	public readonly precision;
	public readonly convertingProps?: ColorSpaceConvertingProps;
	private readonly conversionMap = new Map<ColorSpace, ColorSpaceConversionDescription>();

	constructor({
		name = 'Unnamed ColorSpace',
		keys = ['a', 'b', 'c'],
		conversions = [],
		convertingProps = {},
		precision = 15,
		...props
	}: ColorSpaceConstructorProps) {
		super({ name, ...props });
		this.keys = keys;
		this.precision = precision;
		this.convertingProps = convertingProps;
		for (const csc of conversions) {
			this.addConversion(csc);
		}
	}

	public addConversion({ space: spaceB, toFn, fromFn }: ColorSpaceConversion) {
		const _spaceB = typeof spaceB === 'string' ? ColorSpace.getSpaceById(spaceB) : (spaceB as ColorSpace);
		this.conversionMap.set(_spaceB, { path: [this, _spaceB], fn: toFn });
		_spaceB.conversionMap.set(this, { path: [_spaceB, this], fn: fromFn });
	}
	public hasConversionToSpace(dstSpace: ColorSpace | ColorSpaceName) {
		const _dstSpace =
			typeof dstSpace === 'string' ? ColorSpace.getSpaceById(dstSpace) : (dstSpace as ColorSpace);
		return this.conversionMap.has(_dstSpace);
	}

	/**
	 * Gets color space conversion function to transform current `ColorSpace` values into `dstSpace`.
	 * Retrieves conversion from pre-defined `conversions` property, else find a path via BFS
	 * and add it to its `conversions` if a path exists.
	 * @param dstSpace Destination `ColorSpace` or `ColorSpaceName`
	 * @returns Function composition transforming source space into the destination color space
	 */
	public getConversionBySpace(dstSpace: ColorSpace | ColorSpaceName): ColorSpaceConvertingFunction {
		if (typeof dstSpace === 'string') dstSpace = ColorSpace.getSpaceById(dstSpace);
		return ColorSpace.getConversion(this, dstSpace);
	}

	/**
	 * Static
	 */
	public static named = {} as Record<string, ColorSpace>;

	/**
	 * Returns a named `ColorSpace` by its registered id
	 * @param spaceId Registered id of the `ColorSpace`
	 */
	public static getSpaceById(spaceId: ColorSpaceName) {
		const spaceString = (spaceId as string).toLowerCase();
		if (Object.hasOwn(this.named, spaceString)) return this.named[spaceString];
		else throw new ReferenceError(`ColorSpace '${spaceString}' does not exist`);
	}

	/**
	 * Gets color space conversion function to transform current `ColorSpace` values into `dstSpace`.
	 * Retrieves conversion from pre-defined `conversions` property, else find a path via BFS
	 * and add it to its `conversions` if a path exists.
	 * @param srcSpace Source `ColorSpace` or `ColorSpaceName`
	 * @param dstSpace Destination `ColorSpace` or `ColorSpaceName`
	 * @returns Function composition transforming source space into the destination color space
	 */
	public static getConversion(srcSpace: ColorSpace | ColorSpaceName, dstSpace: ColorSpace | ColorSpaceName) {
		const _srcSpace =
			typeof srcSpace === 'string' ? ColorSpace.getSpaceById(srcSpace) : (srcSpace as ColorSpace);
		const _dstSpace =
			typeof dstSpace === 'string' ? ColorSpace.getSpaceById(dstSpace) : (dstSpace as ColorSpace);

		let conversion = _srcSpace.conversionMap.get(_dstSpace)?.fn;

		//et precisionMin = _dstSpace.precision > _srcSpace.precision ? _srcSpace.precision : _dstSpace.precision;
		if (!conversion) {
			const path = bfsPath(_srcSpace, _dstSpace, (curr) =>
				// Consider only direct paths (path length 2 => [spaceA, spaceB])
				[...curr.conversionMap.keys()].filter((s) => curr.conversionMap.get(s)?.path.length === 2)
			);
			if (!path) throw new Error(`No conversion path found from ${this.name} to ${_dstSpace.name}`);

			const fnList: Array<ColorSpaceConvertingFunction> = [];
			for (let i = 0; i < path.length - 1; i++) {
				fnList.push(path[i].getConversionBySpace(path[i + 1]));
				//if (path[i].precision < precisionMin) precisionMin = path[i].precision;
			}
			conversion = composeFnList(fnList, {
				rgbWhiteLuminance:
					_srcSpace.convertingProps?.rgbWhiteLuminance ?? _dstSpace.convertingProps?.rgbWhiteLuminance,
				rgbBlackLuminance:
					_srcSpace.convertingProps?.rgbBlackLuminance ?? _dstSpace.convertingProps?.rgbBlackLuminance,
			});
			_srcSpace.conversionMap.set(_dstSpace, { path, fn: conversion });

			// Add conversions for every color space along the path towards destination
			for (let i = 0; i < path.length - 2; i++) {
				path[i].conversionMap.set(_dstSpace, {
					path,
					fn: composeFnList(fnList.slice(i), {
						rgbWhiteLuminance:
							path[i].convertingProps?.rgbWhiteLuminance ?? _dstSpace.convertingProps?.rgbWhiteLuminance,
						rgbBlackLuminance:
							path[i].convertingProps?.rgbBlackLuminance ?? _dstSpace.convertingProps?.rgbBlackLuminance,
					}),
				});
			}
			//console.log(`Added path to map: [${path.map((u) => u.name).join(' → ')}]`);
		}

		//const conversionWithPrecision: ColorSpaceConvertingFunction = (values, props) =>
		//	(conversion as ColorSpaceConvertingFunction)(values, props).map((u) => Number(u.toFixed(precisionMin)));

		return conversion;
	}
}

function composeFnList(
	fnList: ColorSpaceConvertingFunction[],
	defaultProps: ColorSpaceConvertingProps = {}
): ColorSpaceConvertingFunction {
	/*
	return (values, props = {}) => {
		let val = values;
		const p = Object.assign({ ...defaultProps }, props);
		for (let i = 0; i < fnList.length; i++) {
			val = fnList[i](val, p);
		}
		return val;
	};
	*/

	return (values, props = {}) =>
		fnList.reduce((a, b) => b(a, Object.assign({ ...defaultProps }, props)), values);
}

interface ColorSpaceConversionDescription {
	path: ColorSpace[];
	fn: ColorSpaceConvertingFunction;
}

export interface ColorSpaceConversion {
	space: ColorSpace | ColorSpaceName;
	toFn: ColorSpaceConvertingFunction;
	fromFn: ColorSpaceConvertingFunction;
}

export interface ColorSpaceConvertingProps {
	rgbWhiteLuminance?: number;
	rgbBlackLuminance?: number;
	refWhiteLuminance?: number;
	refBlackLuminance?: number;
}

export type ColorSpaceConvertingFunction = (values: number[], props?: ColorSpaceConvertingProps) => number[];

/*
export type SomeColorSpaceConversion = <R>(cb: <T extends AnyObj>(c: ColorSpaceConversion<T>) => R) => R;

export const wrappedColorSpaceConversion =
	<T extends AnyObj>(c: ColorSpaceConversion<T>): SomeColorSpaceConversion =>
	(cb) =>
		cb(c);
*/

export interface ColorSpaceNamedMap {}
export type ColorSpaceName = keyof ColorSpaceNamedMap | (string & Record<never, never>);

export const spaces = ColorSpace.named as ColorSpaceNamedMap & Record<string, ColorSpace>;

/*
export type ColorSpaceTypeColorSpace<T> = T extends ColorSpace
	? T
	: T extends string
	? Uppercase<T> extends keyof ColorSpaceNamedMap
		? ColorSpaceNamedMap[Uppercase<T>]
		: ColorSpace
	: unknown;
export type ColorSpaceProps<T> = T extends ColorSpace<infer R> ? R : unknown;
//export type ColorSpaceNameProps<T extends string> = Uppercase<T> extends keyof ColorSpaceNamedMap? ColorSpaceProps<ColorSpaceNamedMap[Uppercase<T>]> : unknown;
export type ColorSpaceTypeProps<T> = ColorSpaceProps<ColorSpaceTypeColorSpace<T>>;
*/
