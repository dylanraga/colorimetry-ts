import { ChromaticAdaptationMethodName, xyzCat } from '../cat.js';
import { ColorSpace, ColorSpaceConstructorProps } from '../space.js';
import { xy } from './chromaticity/xy.js';

export interface XYZ {
	X: number;
	Y: number;
	Z: number;
}

interface XYZSpaceConstructorProps extends ColorSpaceConstructorProps {
	illuminant: xy;
}

class XYZSpace extends ColorSpace {
	public readonly illuminant: xy;

	constructor({
		name = 'XYZ ColorSpace',
		keys = ['X', 'Y', 'Z'],
		illuminant,
		...props
	}: XYZSpaceConstructorProps) {
		super({ name, keys, ...props });
		this.illuminant = illuminant;
	}

	public cat(dstIlluminant: xy, method: ChromaticAdaptationMethodName = 'bradford') {
		const { x: srcx, y: srcy } = this.illuminant;
		const { x: dstx, y: dsty } = dstIlluminant;

		if (srcx === dstx && srcy === dsty) return this;

		const dstSpace = new XYZSpace({
			name: `XYZ ColorSpace (CAT ${dstx} ${dsty})`,
			illuminant: dstIlluminant,
			conversions: [
				{
					space: this,
					toFn: (dstXYZ) => xyzCat(dstXYZ, { x: dstx, y: dsty, Y: 1 }, { x: srcx, y: srcy, Y: 1 }, method),
					fromFn: (srcXYZ) => xyzCat(srcXYZ, { x: srcx, y: srcy, Y: 1 }, { x: dstx, y: dsty, Y: 1 }, method),
				},
			],
		});

		return dstSpace;
	}

	/**
	 * Static
	 */
	public static named = {} as XYZSpaceNamedMap & Record<string, XYZSpace>;
}

export interface XYZSpaceNamedMap {}
export type XYZSpaceName = keyof XYZSpaceNamedMap | (string & Record<never, never>);

declare module '../space' {
	interface ColorSpaceNamedMap extends XYZSpaceNamedMap {}
}

export const xyzSpaces = XYZSpace.named;

export { XYZSpace };
