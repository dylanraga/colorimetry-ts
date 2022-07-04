import { bfsPath } from "../common/util";

class ColorSpace {
	public name: string = 'Unnamed ColorSpace';
	public conversions: Array<{ space: ColorSpace, to: ColorSpaceConversion }> = [];
	public static defaultSpace: ColorSpace;
	public static list: { [name: string]: ColorSpace } = {};

	constructor(public keys: string[]) { }

	static getSpaceByString(spaceString: string) {
		spaceString = spaceString.toUpperCase();
		if (this.list.hasOwnProperty(spaceString))
			return this.list[spaceString];
		else
			throw new ReferenceError(`ColorSpace '${spaceString} does not exist.'`);
	}


	private _getConversion(dstSpace: ColorSpace | (() => ColorSpace)) {
		return this.conversions.find(s => s.space === dstSpace);
	}

	public addConversion(spaceB: ColorSpace, toFn: ColorSpaceConversion, fromFn: ColorSpaceConversion) {
		this.conversions.push({
			space: spaceB,
			to: toFn
		});

		spaceB.conversions.push({
			space: this,
			to: fromFn
		});
	}

	/**
	 * Gets color space conversion function to transform current `ColorSpace` data into `dstSpace`.
	 * Retrieves conversion from pre-defined `conversions` property, else find a path via BFS
	 * and add it to its `conversions` if a path exists.
	 * @param dstSpace Destination color space
	 * @returns Function composition to transform source space into new color space
	 */
	public getConversion(dstSpace: ColorSpace): ColorSpaceConversion {
		let conversion = this._getConversion(dstSpace)?.to;

		if (!conversion) {
			let path = bfsPath(this, dstSpace, curr => curr.conversions.map(s => s.space) );
			if (path) {
				const fnList: Array<ColorSpaceConversion> = [];
				for (let i = 0; i < path.length-1; i++) {
					const fn = path[i]._getConversion(path[i+1])!.to;
					fnList.push(fn);
				}
				const fnComp: ColorSpaceConversion = (data, o) =>
					fnList.reduce((a, b) => b!(a, o), data);

				this.conversions.push({ space: dstSpace, to: fnComp });
				conversion = fnComp;
				//console.log(`Added path to map: [${path.map(u => u.name).join(' => ')}]`);
			} else
				throw new Error(`No conversion path found from ${this.name} to ${dstSpace.name}`);
		}
		return conversion;
	}

}

export type ColorSpaceConversion = (data: number[], options?: {[k: string]: any}) => number[];


export { ColorSpace };