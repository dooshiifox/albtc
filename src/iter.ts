/** Enumerates over an array, returning both the value and the index. */
export function* enumerate<T>(iterable: Iterable<T>): Iterable<[number, T]> {
	let i = 0;
	for (const item of iterable) {
		yield [i, item];
		i++;
	}
}

/** Filters an object by a predicate. */
export function filterObject<T extends Record<string, unknown>>(
	obj: T,
	predicate: (key: keyof T, value: T[keyof T]) => boolean
): Partial<T> {
	return Object.fromEntries(
		Object.entries(obj).filter(([key, value]) =>
			predicate(key as keyof T, value as T[keyof T])
		)
	) as Partial<T>;
}

/** Maps an object. */
export function mapObject<T, U>(
	obj: Record<string, T>,
	map: (key: string, value: T) => U
): Record<string, U> {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [key, map(key, value)])
	);
}

/** Filters and maps an object at the same time. */
export function filterMapObject<T, U>(
	obj: Record<string, T>,
	predicate: (key: string, value: T) => null | U
): Record<string, U> {
	return Object.fromEntries(
		Object.entries(obj).reduce<Array<[string, U]>>((acc, [key, value]) => {
			const result = predicate(key, value);
			if (result === null) return acc;
			acc.push([key, result]);
			return acc;
		}, [])
	);
}

/** Filter and map an array at the same time. */
export function filterMap<T, V>(
	array: Array<T>,
	predicate: (item: T) => null | V
): Array<V> {
	return array.reduce<Array<V>>((acc, item) => {
		const result = predicate(item);
		if (result === null) return acc;
		acc.push(result);
		return acc;
	}, []);
}
