class RGB extends ColorModel {
	R: number;
	G: number;
	B: number;

	constructor(R: number, G: number, Y: number) {
		super('RGB', [R, G, B]);
		this.R = R;
		this.G = G;
		this.B = B;
	}
	to(toType: string, options: {colorSpace?: ColorSpace}) {
		if(toType === 'RGB')	return this;
		const { colorSpace } = options;
		if(!ColorModel.types.includes(toType))	throw new Error(`ColorModel type '${toType}' does not exist`);
	}
	
}