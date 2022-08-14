/*==========================*/
/* Color Difference methods */
/*==========================*/

import { Color } from './color.js';
import { DE_ITP } from './difference/deitp.js';

export type ColorDifferenceMethod<P = Record<string, unknown>> = (colorA: Color, colorB: Color, props: P) => number;

type ColorDifferenceMethodName = keyof ColorDifferenceMethodNamedMap | (string & Record<never, never>);
type ColorDifferenceMethodProps<T> = T extends ColorDifferenceMethod<infer P> ? P : Record<string, unknown>;
type ColorDifferenceMethodTypeMethod<T> = T extends ColorDifferenceMethod
	? T
	: T extends string
	? T extends keyof ColorDifferenceMethodNamedMap
		? ColorDifferenceMethodNamedMap[T]
		: unknown
	: unknown;
type ColorDifferenceMethodType = ColorDifferenceMethod | ColorDifferenceMethodName;

/**
 * Calculates DeltaE between two Colors depending on the method
 */
function getDifference<T extends ColorDifferenceMethodType>(
	colorA: Color,
	colorB: Color,
	method = DE_ITP as T,
	props = {} as ColorDifferenceMethodProps<ColorDifferenceMethodTypeMethod<T>>
) {
	const _method = typeof method === 'string' ? deMethods[method] : (method as ColorDifferenceMethod);
	return _method(colorA, colorB, props);
}

function _getDifference<T extends ColorDifferenceMethodType>(
	this: Color,
	colorB: Color,
	method = DE_ITP as T,
	props = {} as ColorDifferenceMethodProps<ColorDifferenceMethodTypeMethod<T>>
) {
	getDifference(this, colorB, method, props);
}

declare module './color' {
	interface ColorConstructor {
		dE: typeof getDifference;
	}
	interface Color {
		dE: typeof _getDifference;
	}
}

Object.defineProperty(Color, 'dE', getDifference);
Object.defineProperty(Color.prototype, 'dE', _getDifference);

/*
export const DE_UV: DEMethod = (colorA, colorB) => {
	const [u1, v1]: number[] = colorA.get('uv');
	const [u2, v2]: number[] = colorB.get('uv');

	const du = u1 - u2;
	const dv = v1 - v2;

	const dEuv: number = Math.sqrt(du * du + dv * dv);
	return dEuv;
};

export const DE_XY: DEMethod = (colorA, colorB) => {
	const [x1, y1]: number[] = colorA.get('xy');
	const [x2, y2]: number[] = colorB.get('xy');

	const dx = x1 - x2;
	const dy = y1 - y2;

	const dEuv: number = Math.sqrt(dx * dx + dy * dy);
	return dEuv;
};
*/
export const deMethods = {} as ColorDifferenceMethodNamedMap & Record<string, ColorDifferenceMethod>;
