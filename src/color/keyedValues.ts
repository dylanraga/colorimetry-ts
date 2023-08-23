import { Color } from "../color.js";

function getKeyedValues(color: Color) {
  const keys = color.space.keys;
  const values = color.values;
  if (keys.length !== values.length) throw new Error(`Number of keys does not match number of color values`);

  return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
}

function _getKeyedValues(this: Color) {
  return getKeyedValues(this);
}

declare module "../color" {
  interface Color {
    readonly keyedValues: ReturnType<typeof _getKeyedValues>;
  }
}

Object.defineProperty(Color.prototype, "keyedValues", { get: _getKeyedValues });
