export interface RegisterableConstructorProps {
	id?: string;
	name?: string;
	alias?: string[];
}

export abstract class Registerable {
	public readonly id?: string;
	public readonly name?: string;
	public readonly alias?: string[];

	constructor(props: RegisterableConstructorProps) {
		this.id = props.id;
		this.name = props.name;
		this.alias = props.alias;

		const ids = this.id ? [this.id].concat(this.alias ?? []) : [];
		for (const id of ids) {
			this.register(id);
		}
	}

	public register(id: string) {
		(this.constructor as typeof Registerable).register(id, this);

		return this;
	}

	/**
	 * Static
	 */
	public static named: Record<string, Registerable> = {};

	public static register(id: string, registerable: Registerable) {
		this.named[id] = registerable;

		for (
			let parent = Object.getPrototypeOf(this);
			parent instanceof Function && parent !== Registerable;
			parent = Object.getPrototypeOf(parent)
		) {
			parent.named[id] = registerable;
		}
	}

	public static get<T extends typeof Registerable>(this: T, id: string): InstanceType<T> {
		const registerable = this.named[id] as InstanceType<T>;
		if (registerable === undefined) {
			throw new ReferenceError(`${this.name} id '${id}' does not exist`);
		}

		return registerable;
	}
}
