export type Optional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };

export type Nullable<T> = T | null;

export type ArgumentTypes<F extends AnyFunc> = F extends (...args: infer A) => unknown ? A : never;

export type AnyObj = Record<string, unknown>;
export type AnyFunc = (...args: unknown[]) => unknown;
