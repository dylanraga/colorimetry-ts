import ColorModel from "./ColorModel.js";

class ColorSpace {
	#name: string;
	typeOf: ColorModel;
	keys: string[];
	conversions: ColorSpaceConversion[];
	alias?: string[];
	options?: {[k: string]: any};

	constructor(typeOf: ColorModel, conversions: ColorSpaceConversion[]) {
		this.typeOf = typeOf;
		this.conversions = conversions;

		this.keys = typeOf.keys;
		this.alias = [];
	}

	set name(name: string) {
		this.#name = name;
		this.alias.push(name);
	}

	get name(): string {
		return this.#name;
	}

	static RGBConversion;

	//Executes a BFS through the ColorSpace's possible conversions
	//`checkFn()` runs on every traversal. `path` and `visited` are arrays including the total traversal path.
	conversionBFS(checkFn: (currType, path, visited) => any, direction: 'from'|'to' = 'to') {
		let currType: ColorSpace|ColorModel = this;
		let queue: (ColorSpace|ColorModel)[][] = [[currType]];
		let visited: (ColorSpace|ColorModel)[][] = [[]];
		
		while (queue.length) {
			let path: (ColorSpace|ColorModel)[] = queue.shift();

			currType = path[path.length-1];
			visited.push(path);
			
			let response = checkFn(currType, path, visited);
			if (response)
				return response;

			//console.log(currType);

			if (currType instanceof ColorSpace) {
				//only return spaces with conversion path towards/from currType
				const spaces = Object.values(currType.conversions.filter(v=>v.hasOwnProperty(direction))).map(u => u.space);
				for (const t in spaces) {
					//do not add node if it has been visited (by checking the head of the visited path)
					if (!visited.find(v => v[v.length-1] === spaces[t]))
						queue.push([...path, spaces[t]]);
				}
			}
		}
		
	}

	getConversion(space: ColorSpace|ColorModel): any {
		const f = this.conversions.find(e => e.space === space);
		return f;
	}
}

interface ColorSpaceConversion {
	space: ColorSpace|ColorModel;
	from?: any;
	to?: any
}

export default ColorSpace;
export { ColorSpaceConversion };