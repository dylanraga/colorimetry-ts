import ColorModel from "../../ColorModel.js";
import ColorSpace from "../../ColorSpace.js";
import Decimal from "../../common/decimal.mjs";


/* CIExyY */
const CIExyY = new ColorSpace(ColorModel.types.LAB, [
	{
		space: ColorModel.types.XYZ,
		//XYZ -> CIExyY
		from: (XYZ: number[]) => {
			let [X, Y, Z] = XYZ;
			let [x, y] = [Decimal(X).div(Decimal(X).plus(Y).plus(Z)), Decimal(Y).div(Decimal(X).plus(Y).plus(Z))];
			return [Y, x, y];
		},
		//CIExyY -> XYZ
		to: (Yxy: number[]) => {
			let [Y, x, y] = Yxy;
			let XYZ = [Decimal(x).times(Y).div(y), Y, Decimal(1).minus(x).minus(y).times(Y).div(y)];
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
		from: (Yxy: number[]) => Yxy.slice(-2)
	}
]);
CIExy.name = 'CIExy';
CIExy.alias.push('xy');
CIExy.keys = ['x', 'y'];
ColorModel.types.LAB.spaces.CIExy = CIExy;