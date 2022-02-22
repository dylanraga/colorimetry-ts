import Decimal from "../common/decimal.mjs";
import ColorModel from "../ColorModel.js";
import ColorSpace from "../ColorSpace.js";

ColorModel.types.LCh = new ColorModel('LCh', ['L', 'C', 'h']);


//Couple LCh defaultSpace to LAB
delete ColorModel.types.LCh.defaultSpace;
Object.defineProperty(ColorModel.types.LCh, 'defaultSpace', {
	configurable: true,
	set: function(labSpace) {
		this.labSpace = labSpace;
	},
	get: function() {
		const LChSpace = new ColorSpace(ColorModel.types.LCh, [
			{
				space: this.labSpace,
				//LAB -> LCh
				from: (LAB: number[]) => {
					const [L, a, b] = LAB;
					const C = Decimal.sqrt(Decimal.pow(a, 2).plus(Decimal.pow(b, 2)));
					const h = Decimal.atan2(b, a);
			
					return [L, C, h];
				},
				//LCh -> LAB
				to: (LCh: number[]) => {
					const [L, C, h] = LCh;
					const a = Decimal.cos(h).times(C);
					const b = Decimal.sin(h).times(C);
			
					return [L, a, b];
				}
			}
		]);
		LChSpace.name = this.labSpace.name + ' LCh';
		return LChSpace;
	}
});

ColorModel.types.LCh.defaultSpace = ColorModel.types.LAB.defaultSpace;