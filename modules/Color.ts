/*=================*/
/* Color Structure */
/*==========/======*/

import ColorModel, { ColorModelType, ColorModelTypeString } from './ColorModel.js';
import ColorSpace from './ColorSpace.js';

class Color {
	#space: ColorSpace;
	#data: ColorModel;

	constructor(data: ColorModel|ColorModelType, colorSpace?: ColorSpace|string) {
		this.data = data;

		if (typeof colorSpace === 'undefined') {
			let defaultColorSpace;
			const colorModelType = (data instanceof ColorModel)? data.type : ColorModel.matchObj(data);
			switch (colorModelType) {
				case 'ITP':
					defaultColorSpace = ColorSpace.BT2100;
				default:
					defaultColorSpace = ColorSpace.SRGB;
			}
			this.space = defaultColorSpace;
		} else {
			this.space = colorSpace;
		}
	}

	/*
	 *	Member getters & setters
	 */

	get space(): ColorSpace {
		return this.#space;
	}

	set space(colorSpace: ColorSpace|string) {
		if (typeof colorSpace === 'string') {
			if( !ColorSpace[colorSpace.toUpperCase()] )	throw new Error(`ColorSpace '${colorSpace}' does not exist`);

			this.#space = ColorSpace[colorSpace.toUpperCase()];
		} else {
			this.#space = colorSpace;
		}
	}

	get data(): ColorModel {
		return this.#data;
	}

	set data(data: ColorModel|ColorModelType) {
		if (data instanceof ColorModel) {
			this.#data = data;
		} else {
			let colorModelName = ColorModel.matchObj(data);
			if(!colorModelName)	throw new Error(`ColorModel type '${Object.keys(data).join('')}' does not exist`);
			
			this.#data = new ColorModel(colorModelName, data);
		}
	}

	/*
	 *	Member methods
	 */

	get(type: ColorModelTypeString): ColorModel {
		return this.#data.to(type, this.#space);
	}

	to(type: ColorModelType|ColorModelTypeString) {
		this.data = this.data.toRGB(this.space.trc.eotf);
		return this;
	}

	whiteLevel(): number;
	whiteLevel(whiteLevel: number): Color;
	whiteLevel(whiteLevel?: number): Color|number {
		if(typeof whiteLevel === 'undefined')	return this.#space.whiteLevel();

		this.#space = this.#space.whiteLevel(whiteLevel);
		return this;
	}

	blackLevel(): number;
	blackLevel(blackLevel: number): Color;
	blackLevel(blackLevel?: number): Color|number {
		if(typeof blackLevel === 'undefined')	return this.#space.blackLevel();

		this.#space = this.#space.blackLevel(blackLevel);
		return this;
	}

}


export default Color;