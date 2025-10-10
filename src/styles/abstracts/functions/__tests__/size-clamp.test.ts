import { testSass } from "@scripts/scssTest";
import { describe, it } from "vitest";

const func = `@use "abstracts/functions/_index" as *;`;

describe("@function sizeClamp", () => {
  it("clamps a size between min and max with a preferred size", async () => {
    await testSass(
      `${func} .test { width: sizeClamp(rem(16), rem(32)); }`,
      `.test { width: clamp(1rem, 0.69rem + 1.54vw, 2rem); }`
    );
  });

  it("clamps a size between min and max with a preferred size and a custom viewport unit", async () => {
    await testSass(
      `${func} .test { width: sizeClamp(rem(32), rem(72)); }`,
      `.test { width: clamp(2rem, 1.23rem + 3.85vw, 4.5rem); }`
    );
  });
});
