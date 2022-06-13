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
					const C = Math.sqrt(a*a + b*b);
					const h = Math.atan2(b, a);
			
					return [L, C, h];
				},
				//LCh -> LAB
				to: (LCh: number[]) => {
					const [L, C, h] = LCh;
					const a = C * Math.cos(h);
					const b = C * Math.sin(h);
			
					return [L, a, b];
				}
			}
		]);
		LChSpace.name = this.labSpace.name + ' LCh';
		return LChSpace;
	}
});

ColorModel.types.LCh.defaultSpace = ColorModel.types.LAB.defaultSpace;