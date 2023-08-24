import { Color } from "../color.js";
import { colorDiff } from "../diff.js";

function colorEquals(colorA: Color, colorB: Color): boolean {
  return colorDiff(colorA, colorB, "itp") < 1;
}

function _equals(this: Color, colorB: Color) {
  return colorEquals(this, colorB);
}

declare module "../color" {
  interface Color {
    equals: typeof _equals;
  }
}

Color.prototype.equals = _equals;
