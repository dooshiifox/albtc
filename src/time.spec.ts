import { test, assert as viAssert } from "vitest";
import { formatDuration, formatRelativeTime, ms } from "./time";

// eslint-disable-next-line @typescript-eslint/unbound-method
const assert = viAssert.deepStrictEqual;

test("ms works with basic strings", () => {
	assert(ms("678ms"), 678, "milliseconds");
	assert(ms("1s"), 1000, "seconds");
	assert(ms("10s"), 10000, "10 seconds");
	assert(ms("4m"), 240000, "4 minutes");
	assert(ms("8327987678ms"), 8327987678, "big milliseconds");
	assert(ms("12h"), 12 * 60 * 60 * 1000, "12 hours");
	assert(ms("13d"), 13 * 24 * 60 * 60 * 1000, "13 days");
	assert(ms("40mo"), 40 * 30 * 24 * 60 * 60 * 1000, "40 months");
	assert(ms("5y"), 5 * 365 * 24 * 60 * 60 * 1000, "5 years");
});

test("ms works with complex strings", () => {
	assert(
		ms("12h 38m 47s 678ms"),
		((12 * 60 + 38) * 60 + 47) * 1000 + 678,
		"complex string"
	);
	// @ts-expect-error only one space at type level is allowed but it still works
	assert(ms("        47   s         "), 47000, "spaces");
	assert(ms(".25d"), 6 * 60 * 60 * 1000, "decimal day omitting 0");
	assert(
		ms("24.5y 8mo 000.6000d 4.2h 23m 12s 883.44ms"),
		// Funilly doing the repetitive multiplication is more accurate
		// than what we did above with `((hour * 60 + minute) * 60 + second) + millisecond`
		24.5 * 365 * 24 * 60 * 60 * 1000 +
			8 * 30 * 24 * 60 * 60 * 1000 +
			0.6 * 24 * 60 * 60 * 1000 +
			4.2 * 60 * 60 * 1000 +
			23 * 60 * 1000 +
			12 * 1000 +
			883.44,
		"everything"
	);
	assert(ms("04d"), 4 * 24 * 60 * 60 * 1000, "leading zero");
	assert(
		ms("1d22h08m25s099ms"),
		1 * 24 * 60 * 60 * 1000 +
			22 * 60 * 60 * 1000 +
			8 * 60 * 1000 +
			25 * 1000 +
			99,
		"no spaces"
	);
	assert(
		ms("5d -2h 3m -4s 5ms"),
		5 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000 + 3 * 60 * 1000 - 4 * 1000 + 5,
		"negative"
	);

	// @ts-expect-error invalid time string
	assert(ms("weeeeee"), 0, "invalid string");
	// @ts-expect-error invalid time string
	assert(ms("1 2 3 4 5 6"), 0, "many numbers");
	// @ts-expect-error invalid time string
	assert(ms("1 2d"), 0, "number without unit");
	// @ts-expect-error invalid time string
	assert(ms("40ms 5s"), 0, "wrong order");
	assert(ms(""), 0, "empty string");
});

test("ms works with numbers", () => {
	assert(ms(0), 0, "0");
	assert(ms(1), 1, "1");
	assert(ms(1000), 1000, "1000");
	assert(ms(10000), 10000, "10000");
	assert(ms(529874198798367), 529874198798367, "240000");
});

test("format duration", () => {
	assert(formatDuration(0), "0:00", "0");
	assert(formatDuration(1000), "0:01", "1s");
	assert(formatDuration(60000), "1:00", "60s");
	assert(formatDuration(74000), "1:14", "61s");
	assert(formatDuration(3600000), "1:00:00", "1h");
	assert(formatDuration(3661000), "1:01:01", "1h 1m 1s");
	assert(formatDuration(3661123), "1:01:01", "1h 1m 1s 123ms");

	assert(formatDuration("0ms"), "0:00", "0 string");
	assert(formatDuration("4s"), "0:04", "time string");
	assert(formatDuration("20m 40s 800ms"), "20:40", "time with ms");

	assert(formatDuration("2d 3h 4m 5s"), "51:04:05", "complex");

	assert(formatDuration(-10), "0:00", "negative");
});

test("format relative time", () => {
	const now = new Date("2024-01-18 12:00:00");
	// Prevent regressions
	assert(
		formatRelativeTime(new Date("2024-01-18 11:59:59"), { now }),
		"Just now",
		"Defaults to lowercase"
	);
	assert(
		formatRelativeTime(new Date()),
		"Just now",
		"Defaults to current time"
	);

	const frt = (date: string, lowercase = false) =>
		formatRelativeTime(new Date(date), { now, lowercase });

	assert(frt("2024-01-18 12:00:00"), "Just now", "just now but literally");
	assert(
		frt("2024-01-18 12:00:00", true),
		"just now",
		"just now but literally and also lowercase"
	);
	assert(frt("2024-01-18 11:59:59"), "Just now", "just now");
	assert(frt("2024-01-18 11:59:54"), "6 seconds ago", "6s ago");
	assert(frt("2024-01-18 11:59:01"), "59 seconds ago", "59s ago");
	assert(frt("2024-01-18 11:59:00"), "A minute ago", "1m ago");
	assert(frt("2024-01-18 11:59:00", true), "a minute ago", "1m ago lowercase");
	assert(frt("2024-01-18 11:58:10"), "A minute ago", "110 seconds ago");
	assert(frt("2024-01-18 11:58:00"), "2 minutes ago", "2m ago");
	assert(frt("2024-01-18 11:00:01"), "59 minutes ago", "59m ago");
	assert(frt("2024-01-18 11:00:00"), "An hour ago", "1h ago");
	assert(frt("2024-01-18 11:00:00", true), "an hour ago", "1h ago lowercase");
	assert(frt("2024-01-18 5:10:05"), "6 hours ago", "6h ago");
	assert(frt("2024-01-17 5:10:05"), "Yesterday", "1d ago");
	assert(frt("2024-01-17 5:10:05", true), "yesterday", "1d ago lowercase");
	assert(frt("2024-01-16 5:10:05"), "2 days ago", "2d ago");
	assert(frt("2024-01-16 5:10:05", true), "2 days ago", "2d ago lowercase");
	assert(frt("2024-01-4 13:00:00"), "13 days ago", "13d ago");
	assert(frt("2024-01-4 11:00:00"), "4 Jan", "14d ago");
	assert(frt("2023-12-31 11:00:00"), "31 Dec", "dec 31");
	assert(frt("2023-12-1 11:00:00"), "1 Dec", "dec 1");
	assert(frt("2023-10-1 11:00:00"), "1 Oct", "oct 1");
	assert(frt("2023-9-30 11:00:00"), "30 Sept 2023", "sep 30");
	assert(frt("2001-3-5 11:00:00"), "5 Mar 2001", "ages ago");

	assert(frt("2024-01-18 12:00:03"), "In a moment", "very soon");
	assert(frt("2024-01-18 12:00:08"), "In 8 seconds", "in 8s");
	assert(frt("2024-01-18 12:00:08", true), "in 8 seconds", "in 8s lowercase");
	assert(frt("2024-01-18 12:00:59"), "In 59 seconds", "in 1m");
	assert(frt("2024-01-18 12:00:59", true), "in 59 seconds", "in 59s lowercase");
	assert(frt("2024-01-18 12:01:00"), "In a minute", "in 1m");
	assert(frt("2024-01-18 12:01:00", true), "in a minute", "in 1m lowercase");
	assert(frt("2024-01-18 12:01:50"), "In a minute", "in 110s");
	assert(frt("2024-01-18 12:01:50", true), "in a minute", "in 110s lowercase");
	assert(frt("2024-01-18 12:02:50"), "In 2 minutes", "in 2m");
	assert(frt("2024-01-18 12:02:50", true), "in 2 minutes", "in 2m lowercase");
	assert(frt("2024-01-18 12:59:59"), "In 59 minutes", "in 59m");
	assert(frt("2024-01-18 12:59:59", true), "in 59 minutes", "in 59m lowercase");
	assert(frt("2024-01-18 13:00:00"), "In an hour", "in 1h");
	assert(frt("2024-01-18 13:00:00", true), "in an hour", "in 1h lowercase");
	assert(frt("2024-01-18 18:00:00"), "In 6 hours", "in 6h");
	assert(frt("2024-01-18 18:00:00", true), "in 6 hours", "in 6h lowercase");
	assert(frt("2024-01-19 18:00:00"), "Tomorrow", "in 1d");
	assert(frt("2024-01-19 18:00:00", true), "tomorrow", "in 1d lowercase");
	assert(frt("2024-01-31 18:00:00"), "In 13 days", "in 13d");
	assert(frt("2024-01-31 18:00:00", true), "in 13 days", "in 13d lowercase");
	assert(frt("2024-02-01 18:00:00"), "1 Feb", "in 14d");
	assert(frt("2024-02-01 18:00:00", true), "1 Feb", "in 14d lowercase");
	assert(frt("2024-04-30 18:00:00"), "30 Apr", "in 3 months");
	assert(frt("2024-05-01 18:00:00"), "1 May 2024", "in 3 months over");
	assert(frt("2035-06-10 18:00:00"), "10 Jun 2035", "in a long time");
});
