/*================================*/
/* Color Models & Representations */
/*================================*/
import ColorSpace from './ColorSpace.js';


class ColorModel {
	name: string;
	keys: string[];
	defaultSpace: ColorSpace;
	conversionFns: {to: ColorModel, fn: any}[];
	spaces: {[k: string]: ColorSpace};

	constructor(name: string, keys: string[]) {
		this.name = name;
		this.keys = keys;

		this.spaces = {};
		this.conversionFns = [];
	}

	static types: {[k: string]: ColorModel} = {};

	static getType(name: string): ColorSpace|ColorModel {
		for (const t in ColorModel.types) {
			const type = ColorModel.types[t];
			if (type.name.toUpperCase() === name.toUpperCase()) {
				return type;
			}

			for (const s in type.spaces) {
				const space = type.spaces[s];
				if (space.alias.map(u=>u.toUpperCase()).includes(name.toUpperCase()))
					return space;
			}			
		}

		throw new Error(`ColorModel type '${name}' does not exist`);
	}

}


export default ColorModel;