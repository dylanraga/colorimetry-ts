import { mmult } from "../common/util.js";
import Decimal from "../common/decimal.mjs";
import ColorModel from "../ColorModel.js";
import ColorSpace from "../ColorSpace.js";

interface XYZ {
	X: number;
	Y: number;
	Z: number;
}

ColorModel.types.XYZ = {
	keys: ['X', 'Y', 'Z'],
	convertFns: {
		'xyY': (XYZ: number[]) => {
			let [X, Y, Z] = XYZ;
			let [x, y] = [Decimal(X).div(Decimal(X).plus(Y).plus(Z)), Decimal(Y).div(Decimal(X).plus(Y).plus(Z))];
			return [x, y, Y];
		},
		'xy': (XYZ: number[]) => {
			let [X, Y, Z] = XYZ;
			let [x, y] = [Decimal(X).div(Decimal(X).plus(Y).plus(Z)), Decimal(Y).div(Decimal(X).plus(Y).plus(Z))];
			return [x, y];
		}
	}
}


interface xyY {
	x: number;
	y: number;
	Y: number;
}

ColorModel.types.xyY = {
	keys: ['x', 'y', 'Y'],
	//map: ['xy', 'XYZ']
	convertFns: {
		'XYZ': (xyY: number[]) => {
			let [x, y, Y] = xyY;
			let XYZ = [Decimal(x).times(Y).div(y), Y, Decimal(1).minus(x).minus(y).times(Y).div(y)];
			return XYZ;
		},
		'xy': (xyY: number[]) => xyY.slice(0, 2)
	}
}


type xy = Omit<xyY, 'Y'>;

ColorModel.types.xy = {
	keys: ['x', 'y'],
	convertFns: {}
}

export { XYZ, xyY, xy };