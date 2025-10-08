import { testSass } from "@scripts/scssTest";
import { describe, it } from "vitest";

const changeLightness = `@use "abstracts/functions/_index" as *;`;

describe("@function changeLightness", () => {
  it("increases the lightness of a color by a given value", async () => {
    await testSass(
      `${changeLightness} .test { color: changeLightness(hsl(200, 50%, 50%), 20%); }`,
      `.test { color: hsl(200, 50%, 20%); }`
    );
  });

  it("decreases the lightness of a color by a given value", async () => {
    await testSass(
      `${changeLightness} .test { color: changeLightness(hsl(200, 50%, 50%), 10%); }`,
      `.test { color: hsl(200, 50%, 10%); }`
    );
  });

  it("caps the lightness at 0% and 100%", async () => {
    await testSass(
      `${changeLightness} .test { color: changeLightness(hsl(200, 50%, 50%), 200%); }`,
      `.test { color: hsl(200, 50%, 100%); }`
    );

    await testSass(
      `${changeLightness} .test { color: changeLightness(hsl(200, 50%, 50%), -200%); }`,
      `.test { color: hsl(200, 50%, 0%); }`
    );
  });

  it("handles colors with alpha transparency", async () => {
    await testSass(
      `${changeLightness} .test { color: changeLightness(rgba(200, 50, 50, 0.5), 20%); }`,
      `.test { color: hsla(0, 60%, 20%, 0.5); }`
    );
    await testSass(
      `${changeLightness} .test { color: changeLightness(rgba(200, 50, 50, 0.25), 90%); }`,
      `.test { color: hsla(0, 60%, 90%, 0.25); }`
    );
  });

  it("handles different color formats", async () => {
    await testSass(
      `${changeLightness} .test { color: changeLightness(#3498db, 30%); }`,
      `.test { color: hsl(204, 70%, 30%); }`
    );

    await testSass(
      `${changeLightness} .test { color: changeLightness(rgba(23, 116, 178, 1), 40%); }`,
      `.test { color: hsl(204, 77%, 40%); }`
    );

    await testSass(
      `${changeLightness} .test { color: changeLightness(hsl(204, 70%, 50%), 10%); }`,
      `.test { color: hsl(204, 70%, 10%); }`
    );

    await testSass(
      `${changeLightness} .test { color: changeLightness(hsla(204, 70%, 50%, 0.5), 20%); }`,
      `.test { color: hsla(204, 70%, 20%, 0.5); }`
    );

    await testSass(
      `${changeLightness} .test { color: changeLightness(blue, 25%); }`,
      `.test { color: hsl(240, 100%, 25%); }`
    );
  });
});
