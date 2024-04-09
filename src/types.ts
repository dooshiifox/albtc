/** Specifies the given keys are required. */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
	Required<Pick<T, K>>;

/** Specifies the given keys are optional. */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & {
	[P in K]?: T[P] | undefined;
};

/** Gets all values of an array or object. */
export type ValueOf<T> = T[keyof T];

/** Create an array of the same length as `T` but with type `U`. */
export type RepeatForLength<T extends Array<unknown>, U> = T extends [
	infer _,
	...infer R
]
	? [U, ...RepeatForLength<R, U>]
	: [];

/** Creates an array of `T` with length `L` */
export type ArrayOfLength<T, L extends number> = L extends 0
	? []
	: L extends 1
		? [T]
		: [T, ...ArrayOfLength<T, Decrement<L>>];
/** Subtracts 1. */
// prettier-ignore
export type Decrement<N extends number> = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][N];

/** Creates an array of `T` requiring at least one element in it. */
export type NonEmptyArray<T> = [T, ...Array<T>];

/** Indicates that something could be a wrapped promise. */
export type MaybePromise<T> = T | Promise<MaybePromise<T>>;

/** TypeScript 5.4 `NoInfer<T>` back-ported to older versions. */
export type NoInfer<T> = [T][T extends unknown ? 0 : never];

/** Merges two objects. Values in both A and B will be overridden by B. */
export type Override<A, B> = {
	[K in keyof A]: K extends keyof B ? B[K] : A[K];
	// The `& B` is the case where B has properties that A does not have OR
	// if the propetry on A is optional and on B is not.
} & B;
