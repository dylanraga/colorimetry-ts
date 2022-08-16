import { quantizeToBits } from '../common/util.js';
import { ColorGamut, ColorGamutName, gamuts } from '../gamut.js';
import { ColorSpace, ColorSpaceConstructorProps } from '../space.js';
import { curves, ToneResponse, ToneResponseName } from '../trc.js';
import { RGBLinearSpace } from './rgb-linear.js';

interface RGBEncodedSpaceConstructorProps extends ColorSpaceConstructorProps {
	trc: ToneResponse | ToneResponseName;
	gamut: ColorGamut | ColorGamutName;
	bpc?: 0 | 8 | 10 | 12;
	whiteLevel?: number;
	blackLevel?: number;
	peakLuminance?: number;
}

export class RGBEncodedSpace extends ColorSpace {
	public readonly trc: ToneResponse;
	public readonly gamut: ColorGamut;
	public readonly bpc: number;

	constructor({
		name = 'RGB Encoded ColorSpace',
		keys = ['r', 'g', 'b'],
		trc,
		gamut,
		bpc = 0,
		whiteLevel = 100,
		blackLevel = 0,
		...props
	}: RGBEncodedSpaceConstructorProps) {
		const convertingProps = { rgbWhiteLevel: whiteLevel, rgbBlackLevel: blackLevel };
		super({ name, keys, convertingProps, ...props });
		if (typeof trc === 'string') trc = curves[trc];
		if (typeof gamut === 'string') gamut = gamuts[gamut];

		this.trc = trc.props({ whiteLevel, blackLevel });
		this.gamut = gamut;
		this.bpc = bpc;

		// Creates a corresponding linear RGB Space
		this.toLinear();
	}

	/**
	 * Returns a linear RGB Space of the current encoded RGB Space
	 */
	public toLinear() {
		const rgbLinearSpace = RGBLinearSpace.getSpaceByGamut(this.gamut);

		if (!rgbLinearSpace.hasConversionToSpace(this)) {
			rgbLinearSpace.addConversion({
				space: this,
				// RGBLinear -> RGBEncoded
				toFn: (RGBLinear, { rgbWhiteLevel = 1, rgbBlackLevel = 0 } = {}) =>
					RGBLinear_to_RGBEncoded(RGBLinear, {
						trc: this.trc,
						rgbWhiteLevel,
						rgbBlackLevel,
						bpc: this.bpc,
					}),
				// RGBEncoded -> RGBLinear
				fromFn: (RGBEncoded, { rgbWhiteLevel = 1, rgbBlackLevel = 0 } = {}) =>
					RGBEncoded_to_RGBLinear(RGBEncoded, {
						trc: this.trc,
						rgbWhiteLevel,
						rgbBlackLevel,
						bpc: this.bpc,
					}),
			});
		}

		return rgbLinearSpace;
	}

	public toDigital(bpc: 8 | 10 | 12) {
		if (this.bpc > 0) throw new Error(`ColorSpace '${this.name}' is already digital`);

		const newSpace = new RGBEncodedSpace({
			name: `${this.name} (${bpc}-bit)`,
			trc: this.trc,
			gamut: this.gamut,
			bpc: bpc,
			whiteLevel: this.convertingProps?.rgbWhiteLevel,
			blackLevel: this.convertingProps?.rgbBlackLevel,
			conversions: [
				{
					space: this,
					toFn: (RGBQuantized) => RGBQuantized.map((u) => u / (2 >> (bpc - 1 - 1))),
					fromFn: (RGBEncoded) => RGBEncoded.map((u) => quantizeToBits(u, bpc)),
				},
			],
			precision: Math.ceil(Math.log10(2 ** bpc)),
		});

		return newSpace;
	}

	/**
	 * Static
	 */
	public static named = {} as RGBEncodedSpaceNamedMap & Record<string, RGBEncodedSpace>;
}

function RGBLinear_to_RGBEncoded(
	RGBLinear: number[],
	{
		trc,
		rgbWhiteLevel = 1,
		rgbBlackLevel = 0,
		bpc = 0,
	}: { trc: ToneResponse; rgbWhiteLevel: number; rgbBlackLevel: number; bpc: number }
) {
	let rgbEncoded = RGBLinear.map((u) =>
		trc.invEotf(u, { whiteLevel: rgbWhiteLevel, blackLevel: rgbBlackLevel })
	);

	if (bpc > 0) {
		rgbEncoded = rgbEncoded.map((u) => quantizeToBits(u, bpc));
	}

	return rgbEncoded;
}

function RGBEncoded_to_RGBLinear(
	RGBEncoded: number[],
	{
		trc,
		rgbWhiteLevel = 1,
		rgbBlackLevel = 0,
		bpc = 0,
	}: { trc: ToneResponse; rgbWhiteLevel: number; rgbBlackLevel: number; bpc: number }
) {
	return RGBEncoded.map((u) =>
		trc.eotf(bpc > 0 ? u / (2 << (bpc - 1 - 1)) : u, { whiteLevel: rgbWhiteLevel, blackLevel: rgbBlackLevel })
	);
}

export interface RGBEncodedSpaceNamedMap {}
export type RGBEncodedSpaceName = keyof RGBEncodedSpaceNamedMap | (string & Record<never, never>);

declare module '../space' {
	interface ColorSpaceNamedMap extends RGBEncodedSpaceNamedMap {}
}

export const rgbSpaces = RGBEncodedSpace.named;
