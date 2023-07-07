/*==========================*/
/* Color Difference methods */
/*==========================*/

import { Color } from "./color.js";
import { diffs } from "./diffs/index.js";

type ColorDifferenceMethodName = keyof typeof diffs;
export type ColorDifferenceMethod<P = Record<string, any>> = (colorA: Color, colorB: Color, props: P) => number;

type ColorDifferenceMethodProps<T> = T extends ColorDifferenceMethod<infer P> ? P : Record<string, unknown>;

/**
 * Calculates DeltaE between two Colors depending on the method
 */
export function colorDiff<T extends ColorDifferenceMethod | ColorDifferenceMethodName>(
  colorA: Color,
  colorB: Color,
  method: T = diffs.itp as T,
  props = {} as ColorDifferenceMethodProps<T extends ColorDifferenceMethodName ? typeof diffs[T] : T>
) {
  if (typeof method === "string" && !(method in diffs))
    throw new ReferenceError(`Color difference '${method}' does not exist`);

  const _method: ColorDifferenceMethod =
    typeof method === "string" ? diffs[method as ColorDifferenceMethodName] : method;
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
