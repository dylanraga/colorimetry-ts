/*=================*/
/* Color Structure */
/*==========/======*/

import ColorModel, { ColorModelType, ColorModelTypeString } from './ColorModel.js';
import ColorSpace from './ColorSpace.js';

class Color {
	#data: ColorModel;
	#space: ColorSpace;

	constructor(data: ColorModel|ColorModelType, colorSpace?: ColorSpace|string) {
		if (typeof colorSpace === 'undefined') {
			let defaultColorSpace;
			const colorModelType = (data instanceof ColorModel)? data.type : ColorModel.matchObj(data);
			switch (colorModelType) {
				case 'ITP':
					defaultColorSpace = ColorSpace.BT2100;
				break;
				default:
					defaultColorSpace = ColorSpace.SRGB;
				break;
			}
			this.space = defaultColorSpace;
		} else {
			this.space = colorSpace;
		}
		
		this.data = data;
	}

	/*
	 * Member getters & setters
	 */

	get space(): ColorSpace {
		return this.#space;
	}

	set space(colorSpace: ColorSpace|string) {
		if (typeof colorSpace === 'string') {
			if( !ColorSpace[colorSpace.toUpperCase()] )	throw new Error(`ColorSpace '${colorSpace}' does not exist`);

			colorSpace = ColorSpace[colorSpace.toUpperCase()] as ColorSpace;
		}

		/*
		//re-convert RGB/rgb values when re-assigning ColorSpace
		//except on initialization
		const typeOrig = ColorModel.matchObj(this.#data);
		if (this.#space !== undefined
				&& colorSpace !== this.#space
				&& ['RGB', 'rgb'].includes(typeOrig)) {
			this.#data = this.#data.to('XYZ', {colorSpace: this.#space}).to(typeOrig, {colorSpace});
		}
		*/

		this.#space = colorSpace;
	}

	get data(): ColorModel {
		return this.#data;
	}

	//Store color data in an absolute Color Model, e.g. XYZ
	set data(data: ColorModel|ColorModelType) {
		if (data instanceof ColorModel) {
			this.#data = data.to('XYZ', {colorSpace: this.#space});
		} else {
			let colorModelName = ColorModel.matchObj(data);
			if(!colorModelName)	throw new Error(`ColorModel type '${Object.keys(data).join('')}' does not exist`);
			
			this.#data = new ColorModel(colorModelName, data).to('XYZ', {colorSpace: this.#space});
		}
	}

	/*
	 *	Member methods
	 */

	get(type: ColorModelTypeString, options: {colorSpace?: ColorSpace} = {}): ColorModel {
		const { colorSpace = this.#space } = options;
		let dataOrigin = this.#data;

		/* Only needed when data source isn't XYZ
		//Convert from XYZ if source->target ColorSpace is different
		if (colorSpace !== this.#space) {
			dataOrigin = this.#data.to('XYZ', { colorSpace: this.#space });
		}
		*/

		return dataOrigin.to(type, {colorSpace}).toNumbers();
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