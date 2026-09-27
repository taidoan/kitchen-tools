import { describe, it, expect } from "vitest";
import {
  generatePrepTimeClasses,
  generateLatesClasses,
  generateWaitTimeClasses,
  generateDeliveryTimeClasses,
} from "../generateClasses";

describe("generatePrepTimeClasses", () => {
  it("marks on-target prep as success", () => {
    expect(generatePrepTimeClasses("8:00", 8, false)).toBe("bg-clr--success");
  });

  it("marks the tolerance band as warning", () => {
    expect(generatePrepTimeClasses("8:20", 8, false)).toBe("bg-clr--warning");
  });

  it("marks over tolerance as failed", () => {
    expect(generatePrepTimeClasses("8:36", 8, false)).toBe("bg-clr--failed");
  });
});

describe("generateLatesClasses", () => {
  it("uses the late target and 5% warning band", () => {
    expect(generateLatesClasses(25, 25)).toBe("bg-clr--success");
    expect(generateLatesClasses(28, 25)).toBe("bg-clr--warning");
    expect(generateLatesClasses(31, 25)).toBe("bg-clr--failed");
  });
});

describe("wait and delivery classes", () => {
  it("treats the threshold as a pass", () => {
    expect(generateWaitTimeClasses("1:00", false)).toBe("bg-clr--success");
    expect(generateWaitTimeClasses("1:01", false)).toBe("bg-clr--failed");
    expect(generateDeliveryTimeClasses("10:00")).toBe("bg-clr--success");
    expect(generateDeliveryTimeClasses("10:01")).toBe("bg-clr--failed");
  });
});
