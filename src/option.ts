/** An implementation of Rust's `Option` type in TypeScript. */
export class Option<T> {
	private value: ["some", T] | ["none"];

	constructor(value: ["some", T] | ["none"]) {
		this.value = value;
	}

	static fromNullable<T>(value: T | null): Option<T> {
		if (value === null) {
			return none();
		} else {
			return some(value);
		}
	}

	isSome(): boolean {
		return this.value[0] === "some";
	}

	isNone(): boolean {
		return this.value[0] === "none";
	}

	unwrap(): T {
		if (this.isSome()) {
			return this.value[1] as T;
		} else {
			throw new Error("Unwrapping None option");
		}
	}

	expect(message: string): T {
		if (this.isSome()) {
			return this.value[1] as T;
		} else {
			throw new Error(message);
		}
	}

	/** Similar to Rust's `match`. */
	match<U>(matcher: { some: (value: T) => U; none: () => U }): U {
		if (this.isSome()) {
			return matcher.some(this.unwrap());
		} else {
			return matcher.none();
		}
	}
}

export function some<T>(value: T): Option<T> {
	return new Option<T>(["some", value]);
}
export function none<T = never>(): Option<T> {
	return new Option<T>(["none"]);
}
