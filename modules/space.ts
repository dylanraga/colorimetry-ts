import { bfsPath } from "./common/util";

type ColorSpaceConversionFunction<Props = {}> = (values: number[], props: Props) => number[];

interface ColorSpaceConversion {
	space: ColorSpace;
	fn: ColorSpaceConversionFunction<any>
}

abstract class ColorSpace {
	public name: string = 'Unnamed ColorSpace';
	public keys: string[] = [];
	public conversions: ColorSpaceConversion[] = [];
	public static defaultSpace: ColorSpace;
	public static named: { [k: string]: ColorSpace } = {};

	public static getSpaceByName(spaceName: ColorSpaceName) {
		const spaceString = (spaceName as string).toUpperCase();
		if (this.named.hasOwnProperty(spaceString))
			return this.named[spaceString];
		else
			throw new ReferenceError(`ColorSpace '${spaceString}' does not exist`);
	}

	private getExistingConversionBySpace(dstSpace: ColorSpace | (() => ColorSpace)) {
		return this.conversions.find(s => s.space === dstSpace);
	}

	public addConversion<Props = {}>(spaceB: ColorSpace, toFn: ColorSpaceConversionFunction<Props>, fromFn: ColorSpaceConversionFunction<Props>) {
		this.conversions.push({
			space: spaceB,
			fn: toFn
		});

		spaceB.conversions.push({
			space: this,
			fn: fromFn
		});
	}

	/**
	 * Gets color space conversion function to transform current `ColorSpace` data into `dstSpace`.
	 * Retrieves conversion from pre-defined `conversions` property, else find a path via BFS
	 * and add it to its `conversions` if a path exists.
	 * @param dstSpace Destination color space
	 * @returns Function composition to transform source space into new color space
	 */
	public getConversionBySpace(dstSpace: ColorSpace): ColorSpaceConversionFunction {
		let conversion = this.getExistingConversionBySpace(dstSpace)?.fn;

		if (!conversion) {
			let path = bfsPath(this, dstSpace, curr => curr.conversions.map(s => s.space) );
			if (path) {
				const fnList: Array<ColorSpaceConversionFunction> = [];
				for (let i = 0; i < path.length-1; i++) {
					const fn = path[i].getExistingConversionBySpace(path[i+1])!.fn;
					fnList.push(fn);
				}
				const fnComp: ColorSpaceConversionFunction = (data, o) =>
					fnList.reduce((a, b) => b!(a, o), data);

				this.conversions.push({ space: dstSpace, fn: fnComp });
				conversion = fnComp;
				//console.log(`Added path to map: [${path.map(u => u.name).join(' => ')}]`);
			} else throw new Error(`No conversion path found from ${this.name} to ${dstSpace.name}`);
		}
		return conversion;
	}

	public register(nameList: string[]): void;
	public register(name: string): void;
	public register(arg1: string | string[]): void {
		const strings = typeof arg1 === 'string'? [arg1] : arg1;
		
		for (const name of strings) {
			ColorSpace.named[name] = this;
		}
	}

}


export interface ColorSpaceNamedMap { }
export type ColorSpaceName = keyof ColorSpaceNamedMap | (string & Record<never, never>);

export const spaces = ColorSpace.named as { [P in keyof ColorSpaceNamedMap]: ColorSpaceNamedMap[P] };

export { ColorSpace };