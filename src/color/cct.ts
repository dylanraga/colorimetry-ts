/**
 * Correlated Color Temperature module
 */

import { uvToCct } from "../cct.js";
import { Color } from "../color.js";
import { spaces } from "../space.js";

/**
 * Calculates the Correlated Color Temperature of a Color in Kelvin
 * @param color Color to find CCT of
 */
function getCCT(color: Color) {
  const [up, vp] = color.toSpace(spaces.uv).values;

  return uvToCct([up, (2 * vp) / 3]);
}

function _getCCT(this: Color) {
  return getCCT(this);
}

declare module "../color" {
  interface Color {
    readonly cct: ReturnType<typeof _getCCT>;
  }
}

Object.defineProperty(Color.prototype, "cct", { get: _getCCT });
