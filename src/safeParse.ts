/** Safely parses an integer.
 *
 *  If the input is not an integer, it returns `null`.
 *  If the number is not safely parsed (i.e., is `NaN` or `Infinity`),
 *  it returns `null`.
 *  In the event of a decimal number, such as `1.5`, it returns `null`.
 */
export function safeParseInt(x: unknown): number | null {
	let number: number;
	if (typeof x === "number") {
		number = x;
	} else if (typeof x === "string") {
		number = parseFloat(x);
	} else {
		return null;
	}

	if (!Number.isInteger(number)) return null;
	if (isNaN(number)) return null;
	if (!isFinite(number)) return null;
	return number;
}

/** Safely parses a float.
 *
 *  If the input is not a number or parseable number, it returns `null`.
 *  If the number is not safely parsed (i.e., is `NaN` or `Infinity`),
 *  it returns `null`.
 */
export function safeParseFloat(x: unknown): number | null {
	let number: number;
	if (typeof x === "number") {
		number = x;
	} else if (typeof x === "string") {
		number = parseFloat(x);
	} else {
		return null;
	}

	if (isNaN(number)) return null;
	if (!isFinite(number)) return null;
	return number;
}

/** Tries to convert a value into a string. */
export function tryString(thing: unknown) {
	if (typeof thing === "string") return thing;
	if (
		typeof thing === "number" ||
		typeof thing === "bigint" ||
		typeof thing === "boolean"
	) {
		return thing.toString();
	}
	if (thing === undefined) return "undefined";
	if (thing === null) return "null";

	if (thing instanceof Error) {
		return thing.message;
	}
	if (thing instanceof Date) {
		return thing.toISOString();
	}
	if (thing instanceof RegExp) {
		return thing.toString();
	}

	return JSON.stringify(thing);
}
