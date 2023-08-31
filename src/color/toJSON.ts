import { Color } from "../color.js";
import { ColorSpace } from "../space.js";
import { spaces } from "../spaces/index.js";

function _toJSON(this: Color, serializable = true) {
  if (serializable && this.space.id === undefined) throw new Error(`Color space needs an id to be serializable`);
  return { space: this.space.id ?? this.space, values: this.values, context: this.context };
}
declare module "../color" {
  interface Color {
    toJSON: typeof _toJSON;
  }
}
Color.prototype.toJSON = _toJSON;
