/** Implies something is to be done at this point in the code in the future. */
export function todo(): never {
	throw new Error("TODO");
}

/** Implies this code should be unreachable.
 *  Optionally also type-checks the argument to verify this is the case.
 */
export function unreachable(_unreachableTypeCheck?: never): never {
	throw new Error("Reached supposedly unreachable code.");
}

/** While 'todo()' implies something is intended to be done in the future
 *  at this point in the code, 'unimplemented()' implies that something
 *  is intentionally not implemented.
 */
export function unimplemented(): never {
	throw new Error("Unimplemented");
}
