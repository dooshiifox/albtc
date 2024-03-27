/** An implementation of Rust's `Result` type in TypeScript. */
export class Result<T, E> {
	private value: ["ok", T] | ["err", E];

	constructor(value: ["ok", T] | ["err", E]) {
		this.value = value;
	}

	isOk(): boolean {
		return this.value[0] === "ok";
	}

	isErr(): boolean {
		return this.value[0] === "err";
	}

	unwrap(): T {
		if (this.isOk()) {
			return this.value[1] as T;
		} else {
			throw new Error(
				`Unwrapping error result: ${JSON.stringify(this.value[1])}`
			);
		}
	}

	unwrapErr(): E {
		if (this.isErr()) {
			return this.value[1] as E;
		} else {
			throw new Error(
				`Unwrapping successful result: ${JSON.stringify(this.value[1])}`
			);
		}
	}

	expect(message: string): T {
		if (this.isOk()) {
			return this.value[1] as T;
		} else {
			throw new Error(message + `: ${JSON.stringify(this.value[1])}`);
		}
	}

	expectErr(message: string): E {
		if (this.isErr()) {
			return this.value[1] as E;
		} else {
			throw new Error(message);
		}
	}

	map<U>(f: (value: T) => U): Result<U, E> {
		if (this.isOk()) {
			return ok(f(this.unwrap()));
		} else {
			return err(this.unwrapErr());
		}
	}

	mapErr<F>(f: (value: E) => F): Result<T, F> {
		if (this.isErr()) {
			return err(f(this.unwrapErr()));
		} else {
			return ok(this.unwrap());
		}
	}

	/** Fixes the typings on the `Err` variant of a Result. Unsafe operation.
	 *
	 *  # Example
	 *  ```
	 *  function a(): Result<string, string> {
	 *      return ok("good news!");
	 *  }
	 *
	 *  function b(): Result<string, number> {
	 *      const result = a();
	 *      if (result.isErr()) {
	 *          return err(10);
	 *      } else {
	 *          // Without fix: Type error: string is not assignable to number
	 *          return result.fixErr();
	 *      }
	 *  }
	 *  ```
	 */
	fixErr<B>(): Result<T, B> {
		const value = this.expect("cannot use `fixErr` on `Err` Result");
		return ok<T, B>(value);
	}

	/** Fixes the typings on the `Ok` variant of a Result. Throws if this value
	 *  is an `Ok`.
	 *
	 *  # Example
	 *  ```
	 *  function a(): Result<string, string> {
	 *      return err("oh no!");
	 *  }
	 *
	 *  function b(): Result<number, string> {
	 *      const result = a();
	 *      if (result.isErr()) {
	 *          // Without fix: Type error: string is not assignable to number
	 *          return result.fixOk();
	 *      } else {
	 *          return ok(5);
	 *      }
	 *  }
	 *  ```
	 */
	fixOk<A>(): Result<A, E> {
		const error = this.expectErr("cannot use `fixOk` on `Ok` Result");
		return err<A, E>(error);
	}

	/** Similar to Rust's `match`. */
	match<U>(matcher: { ok: (value: T) => U; err: (error: E) => U }): U {
		if (this.isOk()) {
			return matcher.ok(this.unwrap());
		} else {
			return matcher.err(this.unwrapErr());
		}
	}

	/** Flattens a `Result<Result<T, E>, E>` into a `Result<T, E>`. */
	flatten = (() => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return this.match({
			err: (e) => err(e),
			ok: (v) => {
				if (v instanceof Result) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
					return v as any;
				} else {
					return ok(v);
				}
			}
		});
	}) as T extends Result<infer U, E> ? () => Result<U, E> : never;

	/** Returns `undefined` on error, else the inner value. */
	undefined(): T | undefined {
		return this.match({
			ok: (v) => v,
			err: () => undefined
		});
	}

	/** Throws `E` or returns `T`. */
	throw(): T {
		return this.match({
			ok: (v) => v,
			err: (e) => {
				throw e;
			}
		});
	}
}

export function ok<const T, E = never>(value: T): Result<T, E>;
export function ok<T, E = never>(value: T): Result<T, E>;
export function ok<T, E = never>(value: T): Result<T, E> {
	return new Result<T, E>(["ok", value]);
}
export function err<T = never, const E = unknown>(value: E): Result<T, E>;
export function err<T = never, E = unknown>(value: E): Result<T, E>;
export function err<T = never, E = unknown>(value: E): Result<T, E> {
	return new Result<T, E>(["err", value]);
}
