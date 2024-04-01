type TimeFormat<Abbr extends string, Next extends string> = `${
	| `${number}${Abbr}`
	| `${number}${Abbr} `
	| ""}${Next}`;
type Time = TimeFormat<"y", TimeMonth>;
type TimeMonth = TimeFormat<"mo", TimeDay>;
type TimeDay = TimeFormat<"d", TimeHour>;
type TimeHour = TimeFormat<"h", TimeMinute>;
type TimeMinute = TimeFormat<"m", TimeSecond>;
type TimeSecond = TimeFormat<"s", TimeMillisecond>;
type TimeMillisecond = `${number}ms` | "";
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const month = day * 30;
const year = day * 365;
/** A stringified segment of a regex that matches a number,
 *  with any number of spaces at the beginning or end of the string.
 *
 *  The number can be negative, have a decimal point, and also omit the leading
 *  `0` in a decimal number. Examples:
 *  - `-1`
 *  - `.4`
 *  - `123.456`
 *  - `       -.99999        `
 */
const numRe = String(/ *(-?(?:\d+(?:\.\d+)?|\.\d+)) */).slice(1, -1);
const timeRe = new RegExp(
	`^(?:${numRe}y)?(?:${numRe}mo)?(?:${numRe}d)?(?:${numRe}h)?(?:${numRe}m(?=[^s]| *$))?(?:${numRe}s)?(?:${numRe}ms)? *$`
);

export type TimeParseable = Time | number;
/** Convert a string length of time into milliseconds.
 *
 *  The string can be in the format of `1y 2mo 3d 4h 5m 6s 7ms`.
 *  Any of the segments can be omitted.
 *  Whitespace between the segments is optional.
 *  The segments can *not* be in any order.
 *
 *  Examples:
 *  - `ms("6s749ms")` -> `6749`
 *  - `ms("6h")` -> `21600000`
 *  - `ms("8m -14s")` -> `466000`
 */
export function ms(time: TimeParseable): number {
	if (typeof time === "number") return time;

	const [
		_fullMatch,
		years,
		months,
		days,
		hours,
		minutes,
		seconds,
		milliseconds
	] = time.match(timeRe) ?? [];

	const millis =
		Number(years ?? 0) * year +
		Number(months ?? 0) * month +
		Number(days ?? 0) * day +
		Number(hours ?? 0) * hour +
		Number(minutes ?? 0) * minute +
		Number(seconds ?? 0) * second +
		Number(milliseconds ?? 0);

	/* v8 ignore next 4 */
	if (isNaN(millis)) {
		// If this is reached theres a bug in the regex.
		throw new Error("Invalid time string. This is a bug in albtc.");
	}

	return millis;
}

/** Formats a duration in milliseconds for `x:xx` or `x:xx:xx` format,
 *  depending on if hours need to be specified.
 */
export function formatDuration(duration: TimeParseable) {
	const durationSeconds = Math.floor(ms(duration) / 1000);
	if (durationSeconds <= 0) {
		return "0:00";
	}

	const hours = Math.floor(durationSeconds / 3600);
	const minutes = Math.floor((durationSeconds - hours * 3600) / 60);
	const seconds = Math.floor(durationSeconds - hours * 3600 - minutes * 60);

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
			.toString()
			.padStart(2, "0")}`;
	} else {
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	}
}

/** Formats a date relative to the current time.
 *  Moderately opinionated about the format, but should be good for most cases.
 *
 *  Examples:
 * - `formatRelativeTime(new Date())` -> `Just now`
 * - `formatRelativeTime(new Date(Date.now() - ms("1d")))` -> `Yesterday`
 * - `formatRelativeTime(new Date(Date.now() - ms("1m 14s")))` -> `A minute ago`
 * - `formatRelativeTime(new Date(Date.now() - ms("6h 3m")))` -> `6 hours ago`
 * - `formatRelativeTime(new Date(Date.now() + ms("2s")))` -> `In a moment`
 * - `formatRelativeTime(new Date(Date.now() + ms("12d")))` -> `In 12 days`
 * - `formatRelativeTime(new Date(Date.now() + ms("45d")))` -> `6 Aug`
 * - `formatRelativeTime(new Date(Date.now() + ms("130d")))` -> `30 Oct 2024`
 */
export function formatRelativeTime(
	date: Date,
	config?: {
		lowercase?: boolean;
		now?: Date;
	}
): string {
	const now = config?.now ?? new Date();
	const lowercase = config?.lowercase ?? false;

	const within = (time: Time) => date.getTime() > now.getTime() - ms(time);
	const until = (time: Time) => date.getTime() < now.getTime() + ms(time);
	const lower = (str: string) => (lowercase ? str.toLowerCase() : str);

	// Date was in the past
	if (now.getTime() >= date.getTime()) {
		if (within("5s")) return lower("Just now");

		if (within("1m")) {
			const secs = Math.floor((now.getTime() - date.getTime()) / 1000);
			return `${secs} seconds ago`;
		}

		if (within("1h")) {
			const mins = Math.floor((now.getTime() - date.getTime()) / ms("1m"));
			if (mins === 1) return lower("A minute ago");
			return `${mins} minutes ago`;
		}

		if (within("1d")) {
			const hours = Math.floor((now.getTime() - date.getTime()) / ms("1h"));
			if (hours === 1) return lower("An hour ago");
			return `${hours} hours ago`;
		}

		if (within("14d")) {
			const days = Math.floor((now.getTime() - date.getTime()) / ms("1d"));
			if (days === 1) return lower("Yesterday");
			return `${days} days ago`;
		}
	} else {
		// Date is in the future.
		if (until("5s")) return lower("In a moment");

		if (until("1m")) {
			const secs = Math.floor((date.getTime() - now.getTime()) / 1000);
			return lower(`In ${secs} seconds`);
		}

		if (until("1h")) {
			const mins = Math.floor((date.getTime() - now.getTime()) / ms("1m"));
			if (mins === 1) return lower("In a minute");
			return lower(`In ${mins} minutes`);
		}

		if (until("1d")) {
			const hours = Math.floor((date.getTime() - now.getTime()) / ms("1h"));
			if (hours === 1) return lower("In an hour");
			return lower(`In ${hours} hours`);
		}

		if (until("14d")) {
			const days = Math.floor((date.getTime() - now.getTime()) / ms("1d"));
			if (days === 1) return lower("Tomorrow");
			return lower(`In ${days} days`);
		}
	}

	// If within the last 3 months, return `{month} {day}`
	// Else, return `{month} {day}, {year}`
	// Compare by month instead of day.
	// That way a year is only added if the month changes as well.
	// Seeing `12 Jan` next to `13 Jan, 2024` is weird. Better if they both
	// either have the year or not. `31 Jan` next to `1 Feb, 2024` is kinda normal.
	const dateMonths = date.getFullYear() * 12 + date.getMonth();
	const nowMonths = now.getFullYear() * 12 + now.getMonth();
	if (Math.abs(dateMonths - nowMonths) <= 3) {
		// const dateDay = date.getDate();
		return date.toLocaleString("default", {
			month: "short",
			day: "numeric"
		});
		// return `${date.toLocaleString("default", { month: "short" })} ${dateDay}`;
	}

	return date.toLocaleString("default", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}

/** Calls `setTimeout` and returns a function that calls `clearTimeout` */
export function createTimeout(
	callback: () => unknown,
	time: TimeParseable
): () => void {
	const timeoutId = setTimeout(callback, ms(time));
	return () => {
		clearTimeout(timeoutId);
	};
}
