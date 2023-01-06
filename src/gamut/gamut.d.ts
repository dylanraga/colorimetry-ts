import { xy } from "../space/chromaticity/xy.js";

export interface ColorGamutPrimaries {
  id?: string;
  name?: string;
  alias?: string[];
  white: xy;
  red: xy;
  green: xy;
  blue: xy;
  black?: xy;
}
