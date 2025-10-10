import { testSass } from "@scripts/scssTest";
import { describe, it } from "vitest";

const mqMixin = '@use "abstracts/mixins/mq" as *;';

const breakpoints: Record<string, number> = {
  sm: 20, // 320 / 16
  base: 23.4375, // 375 / 16
  "base-lg": 48, // 768 / 16
  md: 64, // 1024 / 16
  "md-lg": 75, // 1200 / 16
  lg: 90, // 1440 / 16
  "lg-xl": 120, // 1920 / 16
  "lg-xxl": 160, // 2560 / 16
};

describe("@mixin mq()", () => {
  Object.entries(breakpoints).forEach(([breakpoint, minWidth]) => {
    it(`returns the '${breakpoint}' breakpoint media query`, async () => {
      await testSass(
        `${mqMixin} .test { color: red; @include mq('${breakpoint}') { color: blue; } }`,
        `.test { color: red; } @media screen and (min-width: ${minWidth}em) { .test { color: blue; } }`
      );
    });

    it(`returns the '${breakpoint}' breakpoint media query with max`, async () => {
      await testSass(
        `${mqMixin} .test { color: red; @include mq('${breakpoint}', 'max') { color: blue; } }`,
        `.test { color: red; } @media screen and (max-width: ${minWidth}em) { .test { color: blue; } }`
      );
    });

    it(`returns the '${breakpoint}' breakpoint media query with landscape orientation`, async () => {
      await testSass(
        `${mqMixin} .test { color: red; @include mq('${breakpoint}', 'min', 'width', 'landscape') { color: blue; } }`,
        `.test { color: red; } @media screen and (min-width: ${minWidth}em) and (orientation: landscape) { .test { color: blue; } }`
      );
    });

    it(`returns the '${breakpoint}' breakpoint media query with max and portrait orientation`, async () => {
      await testSass(
        `${mqMixin} .test { color: red; @include mq('${breakpoint}', 'max', 'width', 'portrait') { color: blue; } }`,
        `.test { color: red; } @media screen and (max-width: ${minWidth}em) and (orientation: portrait) { .test { color: blue; } }`
      );
    });
  });
});
