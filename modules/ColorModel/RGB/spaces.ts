import ColorGamut from "../../ColorGamut.js";
import ColorModel from "../../ColorModel.js";

//default targets
ColorModel.types.RGB.conversionFns = ColorModel.types.RGB.conversionFns.map(
	u => {
		const to = u.to;
		const newFn = (v => u.fn(v, ColorGamut.SRGB))

		return {to, fn: newFn}
	}
);
