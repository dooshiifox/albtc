let count = 0;

/** Returns a new unique ID. */
export function newId() {
	return ++count;
}

/** Sets a unique ID on a node if it doesn't already have an ID. */
export function setUniqueNodeId(node: HTMLElement, prefix: string) {
	if (node.id === "") {
		node.id = `${prefix}:${newId()}`;
	}
	return node;
}
