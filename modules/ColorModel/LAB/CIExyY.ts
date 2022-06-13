import ColorModel from "../../ColorModel.js";
import ColorSpace from "../../ColorSpace.js";


/* CIExyY */
const CIExyY = new ColorSpace(ColorModel.types.LAB, [
	{
		space: ColorModel.types.XYZ,
		//XYZ -> CIExyY
		from: ([X, Y, Z]: number[]) => {
			let [x, y] = [X/(X+Y+Z), Y/(X+Y+Z)];
			return [Y, x, y];
		},
		//CIExyY -> XYZ
		to: ([Y, x, y]: number[]) => {
			let XYZ = [x*Y/y , Y, (1-x-y)*Y/y];
			return XYZ;
		}
	}
]);
CIExyY.name = 'CIExyY';
CIExyY.alias.push('xyY', 'Yxy');
CIExyY.keys = ['Y', 'x', 'y'];
ColorModel.types.LAB.spaces.CIExyY = CIExyY;


/* CIExy */
const CIExy = new ColorSpace(ColorModel.types.LAB, [
	{
		space: CIExyY,
		//CIExyY -> CIExy
		from: ([Y, x, y]: number[]) => [x, y]
	}
]);
CIExy.name = 'CIExy';
CIExy.alias.push('xy');
CIExy.keys = ['x', 'y'];
ColorModel.types.LAB.spaces.CIExy = CIExy;