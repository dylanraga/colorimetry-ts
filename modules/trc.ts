import { Registerable, RegisterableConstructorProps } from './registerable.js';

interface ToneResponseConstructorProps<P = unknown> extends RegisterableConstructorProps {
	eotf: ElectroOpticalTransferFunction<P>;
	invEotf: ElectroOpticalInverseTransferFunction<P>;
}

export class ToneResponse<P = unknown> extends Registerable {
	public readonly eotf: ElectroOpticalTransferFunction<P>;
	public readonly invEotf: ElectroOpticalInverseTransferFunction<P>;

	constructor({ name = 'Unnamed ToneResponse', eotf, invEotf, ...props }: ToneResponseConstructorProps<P>) {
		super({ name, ...props });
		this.eotf = eotf;
		this.invEotf = invEotf;
	}

	public props(
		newTransferProps: Partial<P>,
		newClassProps?: Partial<ToneResponseConstructorProps<P>>
	): ToneResponse<P> {
		return new ToneResponse<P>({
			name: `${this.name} (copy)`,
			eotf: (V, p) => this.eotf(V, { ...newTransferProps, ...p }),
			invEotf: (L, p) => this.invEotf(L, { ...newTransferProps, ...p }),
			...newClassProps,
		});
	}

	/**
	 * Static
	 */
	public static named = {} as ToneResponseNamedMap & Record<string, ToneResponse<unknown>>;
}

type ElectroOpticalTransferFunction<P = unknown> = (signalValue: number, props?: Partial<P>) => number;

type ElectroOpticalInverseTransferFunction<P = unknown> = (luminanceValue: number, props?: Partial<P>) => number;

//export interface ToneResponseNamedMap { };
export type ToneResponseName = keyof ToneResponseNamedMap | (string & Record<never, never>);

export const curves = ToneResponse.named;
