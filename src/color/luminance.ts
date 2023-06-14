/**
 * Color luminance module
 */
import { Color } from "../color.js";
import { spaces } from "../space.js";

function getLuminance(color: Color) {
  return color.toSpace(spaces.xyz).values[1];
}

function _getLuminance(this: Color) {
  return getLuminance(this);
}

declare module "../color" {
  interface Color {
    readonly luminance: ReturnType<typeof _getLuminance>;
  }
}

Object.defineProperty(Color.prototype, "luminance", { get: _getLuminance });
