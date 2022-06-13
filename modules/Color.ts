/*=================*/
/* Color Structure */
/*=================*/
import ColorModel from './ColorModel.js';
import ColorSpace from './ColorSpace.js';

class Color {
	#data: number[];
	#space: ColorSpace;
	options: {[k: string]: any};

	constructor(space: ColorSpace|ColorModel|string, data: number[], options?: {[k: string]: any}) {
		if (typeof space === 'string')
			space = ColorModel.getType(space);
		if (space instanceof ColorModel)
			space = space.defaultSpace;
		
		/*
		if (options) {
			space = new ColorSpace(space.typeOf, [...space.conversions]);
			space.conversions = space.conversions.map(u => {
				const from = u.from? (a, o) => u.from(a, {...options, ...o}) : undefined;
				const to = u.to? (a, o) => u.to(a, {...options, ...o}) : undefined;
				const v = {space: u.space, from, to};
				return v;
			});
		}
		*/

		this.#space = space;
		this.#data = data;
		this.options = options;
	}

	//Returns desired ColorModel data
	//Accepts inputs as ColorSpace, ColorModel (default space), string look-up space
	//Only ColorSpaces will have conversions; ColorModels can be conversion targets of ColorSpaces.
	get(toSpace: ColorSpace|ColorModel|string, options?: {[k:string]: any}) {
		const fromSpace = this.#space;

		if (typeof toSpace === 'string')
			toSpace = ColorModel.getType(toSpace);
		
		if (!toSpace) throw new Error(`ColorSpace '${toSpace}' does not exist`);

		//BFS through conversion spaces
		//If no path fromSpace -> toSpace, check toSpace -> fromSpace
		//Otherwise check for intersections by checking if the traversing type matches a head of fromSpace's visitedPaths
		let visitedPaths: (ColorSpace|ColorModel)[][];
		var fromSpacePath, toSpacePath;
		fromSpacePath = fromSpace.conversionBFS((currType, path, visited) => {
			visitedPaths = visited;
			if (currType === toSpace)
				return path;
		});

		//console.log(visitedPaths.map(u=>u.map(v=>v.name)));
		if (!fromSpacePath) {
			//Since ColorModels don't have conversions, assume its defaultSpace
			if (toSpace instanceof ColorModel)
				toSpace = toSpace.defaultSpace;

			toSpacePath = toSpace.conversionBFS((currType, path) => {
				if (currType === fromSpace || currType === fromSpace.typeOf)
					return path.reverse();
					
				const intersectingPath = visitedPaths.find(v => v[v.length-1] === currType);
				if (intersectingPath)
					return [...intersectingPath, ...path.reverse().slice(1)];
			}, 'from');
		}
		
		let conversionPath = fromSpacePath || toSpacePath;
		if (!conversionPath) throw new Error(`Could not convert from ColorSpace name '${fromSpace.name}' to '${toSpace.name}'`);

		console.log(conversionPath.map(u=>u.name));
		let newData = this.#data;
		for (const t in conversionPath.slice(0, -1)) {
			let conversion;
			if (conversionPath[t] instanceof ColorSpace) {
				conversion = conversionPath[t].getConversion(conversionPath[+t+1]) || conversionPath[+t+1].getConversion(conversionPath[t]);
			} else {
				conversion = conversionPath[+t+1].getConversion(conversionPath[t]);
			}

			//console.log(conversionPath[t].name, newData)
			newData = conversion.space === conversionPath[+t+1]? conversion.to(newData, options) : conversion.from(newData, options);
		}

		return newData;
	}
}

export default Color;