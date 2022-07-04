/*=================*/
/* Color Structure */
/*=================*/
import { ColorSpace } from './ColorSpace/ColorSpace';
import { DE_ITP } from './ColorDifference';
import { RGBSpace, XYZSpace } from '../colorimetry';

class Color {
	public space: ColorSpace;
	public data: number[]
	constructor( space: ColorSpace | string, data: number[] ) {
		if (typeof space === 'string')
			space = ColorSpace.getSpaceByString(space);
		
		this.space = space;
		this.data = data;
	}

	public get(toSpace: ColorSpace | string) {
		const fromSpace = this.space;
		let currData = this.data;
		if (fromSpace === toSpace) return currData;

		if (typeof toSpace === "string")
			toSpace = ColorSpace.getSpaceByString(toSpace);

		const conversion = fromSpace.getConversion(toSpace)!;
		const newData = conversion(currData);
		
		return newData;
	}

	
	public dE(colorB: Color, options: {[k: string]: any} = {}): number {
		return Color.dE(this, colorB, options);
	}

	public get luminance() {
		return this.get(XYZSpace.defaultSpace)[1];
	}

	/*
	public get luma() {
		if (this.space !instanceof RGBSpace)
			throw new TypeError(`Only colors with defined RGB ColorSpace can have luma`);
	}
	*/

	/*
	whiteLevel(): number;
	whiteLevel(Lw: number): Color;
	whiteLevel(parmA?: number): Color|number {
		if(typeof parmA === 'undefined')	return this.#space.options.gamut.whiteLevel();

		this.#space.options.gamut = this.#space.options.gamut.whiteLevel(parmA);
		return this;
	}
	*/
	

	/*
	 * Static methods
	 */

	
	static dE(colorA: Color, colorB: Color, options: {[k: string]: any} = {}): number {
		const {
			method = DE_ITP
		} = options;

		return method(colorA, colorB, options);
	}
	
}

export { Color };