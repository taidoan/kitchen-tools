import { testSass } from "@scripts/scssTest";
import { describe, it } from "vitest";

const unitFunction = '@use "abstracts/functions/units" as *;';

describe("@function stripUnit()", () => {
  it.each([
    ["16px", "16"],
    ["2rem", "2"],
    ["50%", "50"],
    ["10em", "10"],
    ["0", "0"],
    ["2vh", "2"],
    ["3vw", "3"],
    ["5vmin", "5"],
    ["5vmax", "5"],
    ["1.5rem", "1.5"],
  ])("strips the unit from %s", async (input, expected) => {
    await testSass(
      `${unitFunction} .test { width: stripUnit(${input}); }`,
      `.test { width: ${expected}; }`
    );
  });
});

describe("@function rem()", () => {
  it.each([
    ["rem(10px)", "0.63rem"],
    ["rem(16)", "1rem"],
    ["rem(32px)", "2rem"],
    ["rem(24px)", "1.5rem"],
    ["rem(0)", "0rem"],
  ])("converts %s to rem units", async (input, expected) => {
    await testSass(
      `${unitFunction} .test { width: ${input}; }`,
      `.test { width: ${expected}; }`
    );
  });
});

describe("@function em()", () => {
  it.each([
    ["em(16px)", "1em"],
    ["em(32px)", "2em"],
    ["em(24px)", "1.5em"],
    ["em(0)", "0em"],
    ["em(10px, 20px)", "0.5em"],
    ["em(15, 30)", "0.5em"],
    ["em(30px, 15px)", "2em"],
    ["em(18, 9)", "2em"],
  ])("converts %s to em units", async (input, expected) => {
    await testSass(
      `${unitFunction} .test { font-size: ${input}; }`,
      `.test { font-size: ${expected}; }`
    );
  });
});
