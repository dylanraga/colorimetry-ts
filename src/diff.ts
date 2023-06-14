/*==========================*/
/* Color Difference methods */
/*==========================*/

import { Color } from "./color.js";
import * as _diffs from "./diffs/index.js";
export const diffs = _diffs as typeof _diffs & Record<string, ColorDifferenceMethod>;

type ColorDifferenceMethodName = keyof typeof _diffs;
export type ColorDifferenceMethod<P = Record<string, any>> = (colorA: Color, colorB: Color, props: P) => number;

type ColorDifferenceMethodProps<T> = T extends ColorDifferenceMethod<infer P> ? P : Record<string, unknown>;

/**
 * Calculates DeltaE between two Colors depending on the method
 */
export function colorDiff<T extends ColorDifferenceMethod | ColorDifferenceMethodName>(
  colorA: Color,
  colorB: Color,
  method = diffs.itp as T,
  props = {} as ColorDifferenceMethodProps<T extends ColorDifferenceMethodName ? typeof diffs[T] : T>
) {
  const _method = typeof method === "string" ? diffs[method] : (method as ColorDifferenceMethod);
  return _method(colorA, colorB, props);
}

function _diff<T extends ColorDifferenceMethod | ColorDifferenceMethodName>(
  this: Color,
  colorB: Color,
  method: T = diffs.itp as T,
  props = {} as ColorDifferenceMethodProps<T extends ColorDifferenceMethodName ? typeof diffs[T] : T>
) {
  return colorDiff(this, colorB, method, props);
}

declare module "./color" {
  interface Color {
    diff: typeof _diff;
  }
}

Color.prototype.diff = _diff;
