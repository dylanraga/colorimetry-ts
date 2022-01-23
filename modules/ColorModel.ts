/*================================*/
/* Color Models & Representations */
/*================================*/

import Decimal from './common/decimal.mjs';
import { arrayEquals, bfsPath, minv, mmult } from './common/util.js';
import ColorSpace from './ColorSpace.js';
import { XYZ } from './ColorModel/CIEXYZ.js';

class ColorModel {
	#type: string;
	#data: number[];

	constructor(type: string, data: number[]) {
		if (Object.keys(!ColorModel.types).includes(type)) throw new Error(`ColorModel type '${type}' does not exist`);
		this.#type = type;
		this.#data = data;

		ColorModel.types[type].keys.forEach((k, i) => {
			this[k] = data[i];
		});
	}

	static types: {[key: string]: ColorModelType} = {};
	
	//returns the ColorModel type that matches the keys in the object input
	static matchObj(obj: ColorModel|{[key: string]: number}): string {
		let inputKeys = Object.keys(obj).sort();
		let modelTypes = Object.keys(ColorModel.types);

		for (const type of modelTypes) {
			let modelKeys = ColorModel.types[type].keys.sort();
			if (arrayEquals(inputKeys, modelKeys))
				return type;
		}
	}
	
	/*
	 *	Member methods
	 */

	to(toType: string, options: {colorSpace?: ColorSpace}) {
		let fromType = this.#type;
		if(fromType === toType)	return this;
		const { colorSpace } = options;
		if(!Object.keys(ColorModel.types).includes(toType))	throw new Error(`ColorModel type '${toType}' does not exist`);

		if (ColorModel.types[fromType].convertFns.hasOwnProperty(toType)) {
			const newData = ColorModel.types[fromType].convertFns[toType](this.#data, colorSpace);
			return new ColorModel(toType, newData);
		}

		//If no direct conversion:
		//Use BFS shortest path fromType -> toType
		//Convert through this path
		const typeMap = {};
		Object.keys(ColorModel.types).map(type => typeMap[type] = Object.keys(ColorModel.types[type].convertFns));
		
		let path = bfsPath(fromType, toType, typeMap).slice(1);
		if (path.length === 0) throw new Error(`Cannot convert from ColorModel type '${fromType}' to '${toType}'`);
		let newType: ColorModel = this;
		for (let k of path) {
			newType = newType.to(k, {colorSpace});
		}
		return newType;

	}
	
	//Returns new ColorModel with Number data instead of Decimal
	toNumbers() {
		const newData = this.#data.map(u => +Decimal(u).toDecimalPlaces(15));
		const newModel = new ColorModel(this.#type, newData);
		
		return newModel;
	}

}

interface ColorModelType {
	keys: string[];
	convertFns: { [key: string]: any }
}

//export type ColorModelTypeString = typeof ColorModel.types[number];
//export type ColorModelObj = XYZ;
export default ColorModel;