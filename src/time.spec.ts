import { test, assert as viAssert } from "vitest";
import { formatDuration, ms } from "./time";

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
