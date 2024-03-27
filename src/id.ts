let count = 0;

export function newId() {
	return ++count;
}

export function setUniqueNodeId(node: HTMLElement, prefix: string) {
	if (node.id === "") {
		node.id = `${prefix}:${newId()}`;
	}
	return node;
}
