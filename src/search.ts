import { filterMap } from "./iter";

type KeyResult = {
	/** How important this key is relative to other keys. Higher = closer to top.
	 *
	 *  For example, one might want to prioritize the name of a thing over its description.
	 *  Suppose the name has a bias of 3 and the description has a bias of 1,
	 *  then even if the description was an exact match, if the name starts with
	 *  the query, the name would be prioritized over the description. However,
	 *  if it was a 'character appears in order' match, the description would be prioritized.
	 */
	bias: number;
	/** The actual string to compare against. */
	value: string;
	/** The minimum (inclusive, unweighted) priority. If something is less than
	 *  this, it is discarded.
	 *
	 *  Preferably use something from `SEARCH_PRIORITIES`.
	 *
	 *  @default 0
	 */
	minPriority?: number;
};

export function filterByString<T>(
	searchQuery: string,
	data: Array<T> | undefined,
	key: (item: T) => string | Array<KeyResult>,
	filter: (item: T) => boolean = () => true
): Array<T> {
	const query = searchQuery.trim().toLowerCase();

	if (data === undefined) return [];
	if (query.length === 0) return data;

	return filterMap<T, [number, T]>(data, (item) => {
		// User doesn't want this entry
		if (!filter(item)) return null;

		const name = key(item);
		const entries: Array<KeyResult> = Array.isArray(name)
			? name
			: [{ bias: 1, value: name }];

		// Find the highest priority in all the searchable text for this entry
		const best = entries.reduce((currentBest, entry) => {
			const priority = getPriorityOfString(entry.value, query);
			// User wants to discard it
			// E.g., they are only looking for the beginning of a word or
			// exact matches, but this just has characters in order
			const minPriority = entry.minPriority ?? 0;
			if (priority < minPriority) return currentBest;

			const biasedPriority = priority * entry.bias;

			return Math.max(currentBest, biasedPriority);
		}, 0);

		// Nothing matched, remove it from the list
		if (best === 0) return null;

		return [best, item];
	})
		.sort((a, b) => b[0] - a[0])
		.map((c) => c[1]);
}

export const SEARCH_PRIORITIES = {
	/** The search query is an exact match to the string.
	 *  E.g., `pi` matches '**Pi**'
	 */
	EXACT_MATCH: 6,
	/** The search query appears, in full, at the start of the string as the
	 *  *full* word.
	 *  E.g., `pi` matches '**Pi** Shop'
	 */
	STARTS_WITH_FULL_WORD: 5,
	/** The search query appears, in full, at the start of the string.
	 *  E.g., `pi` matches '**Pi**zza Card'
	 */
	STARTS_WITH: 4,
	/** The search query appears, in full, after a space (thus denoting the
	 *  beggining of a word.)
	 *  E.g., `pi` matches 'Papa's **Pi**zzeria'
	 */
	STARTS_WITH_AFTER_SPACE: 3,
	/** The search query appears, in full, somewhere in the string.
	 *  E.g., `pi` matches 'Pop**pi**ng In'
	 */
	INCLUDES: 2,
	/** The characters in the search query appear, in order, in the string.
	 *  E.g., `pi` matches '**P**ay **i**t Now'
	 */
	CHARACTERS_IN_ORDER: 1,
	/** The search query does not appear in the string.
	 *  E.g., `pi` does not match 'Glopsop's Mop Shop'
	 */
	NO_MATCH: 0
} as const;

/** Gives priority to strings based on how close they are to the query.
 *  - `6`: Exact match
 *  - `5`: Starts with full word
 *  - `4`: Starts with
 *  - `3`: Starts with after a space
 *  - `2`: Includes in entirity anywhere in string
 *  - `1`: Where characters appear in order
 *  - `0`: No match
 *
 *  E.g., given `Pi` as the query, this function would return the following
 *  priorities for each `str`:
 *  - `6`: **Pi**
 *  - `5`: **Pi **Shop
 *  - `4`: **Pi**zza Card
 *  - `3`: Papa's** Pi**zzeria
 *  - `2`: Pop**pi**ng In
 *  - `1`: **P**ay **i**t Now
 *  - `0`: Glopsop's Mop Shop
 */
function getPriorityOfString(str: string, query: string): number {
	str = str.toLowerCase();
	query = query.toLowerCase();
	if (str === query) return SEARCH_PRIORITIES.EXACT_MATCH;
	if (str.startsWith(query + " "))
		return SEARCH_PRIORITIES.STARTS_WITH_FULL_WORD;
	if (str.startsWith(query)) return SEARCH_PRIORITIES.STARTS_WITH;
	if (str.includes(" " + query))
		return SEARCH_PRIORITIES.STARTS_WITH_AFTER_SPACE;
	if (str.includes(query)) return SEARCH_PRIORITIES.INCLUDES;
	if (createEscapedRegex(query).test(str))
		return SEARCH_PRIORITIES.CHARACTERS_IN_ORDER;
	return SEARCH_PRIORITIES.NO_MATCH;
}

function createEscapedRegex(str: string) {
	// Characters that have special meaning in regex syntax
	// need to be escaped. other characters should *not* be escaped
	// because theyre sometimes given special meaning (e.g., \1 or \d or \w)
	const SPECIAL_REGEX_CHARACTERS = "-[]/{}()*+?.\\^$|";
	return new RegExp(
		str
			.split("")
			.map((c) => (SPECIAL_REGEX_CHARACTERS.includes(c) ? "\\" + c : c))
			.join(".*"),
		"i"
	);
}
