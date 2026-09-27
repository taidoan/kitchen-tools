import { describe, expect, it } from "vitest";
import type { ProductItem } from "../groupCategory";
import {
  aggregateComparedRows,
  aggregateLFLByCategory,
  compactLFLName,
  compareLFL,
  productKey,
} from "../compareLFL";

const item = (overrides: Partial<ProductItem> & Pick<ProductItem, "Product Name">): ProductItem => ({
  Category: "Breakfasts",
  "Sub Category": "Breakfast",
  "Quantity Sold": 10,
  "Value of Sales": 100,
  "Gross Sales": 110,
  Discount: 5,
  Promotion: 5,
  Tax: 16.67,
  ...overrides,
});

describe("compactLFLName", () => {
  it("strips ST/AC suffixes and ignores spaces, punctuation and & spacing", () => {
    expect(compactLFLName("Beef Big SmokeST")).toBe("beefbigsmoke");
    expect(compactLFLName("Beef Classic ST")).toBe("beefclassic");
    expect(compactLFLName("AmericanBurg")).toBe("americanburg");
    expect(compactLFLName("American BurgST")).toBe("americanburg");
    expect(compactLFLName("UltimateBurger")).toBe("ultimateburger");
    expect(compactLFLName("Ultimate BurgeST")).toBe("ultimateburge");
    expect(compactLFLName("Ham Egg & Chips")).toBe("hamegg&chips");
    expect(compactLFLName("Ham Egg& ChipsST")).toBe("hamegg&chips");
    expect(compactLFLName("Sml HB Cod &Chip")).toBe("smlhbcod&chip");
    expect(compactLFLName("Sml HB Cod&ChiAC")).toBe("smlhbcod&chi");
    expect(compactLFLName("Steak & Ale Pud")).toBe("steak&alepud");
    expect(compactLFLName("Steak&Ale PuddST")).toBe("steak&alepudd");
  });

  it("does not strip st inside words like Breakfast", () => {
    expect(compactLFLName("Breakfast")).toBe("breakfast");
    expect(compactLFLName("Large Breakfast")).toBe("largebreakfast");
  });

  it("normalises jacket potato naming", () => {
    const category = "Jacket Potatoes";
    expect(compactLFLName("Extra Tuna Jkt", category)).toBe("extratuna");
    expect(compactLFLName("Extra Tuna Jacket", category)).toBe("extratuna");
    expect(compactLFLName("Jacket Beans", category)).toBe("beans");
    expect(compactLFLName("Beans Jacket", category)).toBe("beans");
    expect(compactLFLName("Jacket Cheese", category)).toBe("cheese");
    expect(compactLFLName("Jacket MedVeg", category)).toBe("medveg");
    expect(compactLFLName("Jacket Med Veg", category)).toBe("medveg");
    expect(compactLFLName("Jacket NonCarne", category)).toBe("noncarne");
    expect(compactLFLName("Jacket Non Carne", category)).toBe("noncarne");
    expect(compactLFLName("Jacket SmokyB", category)).toBe("smokyb");
    expect(compactLFLName("Jacket Smoky Beans", category)).toBe("smokybeans");
    expect(compactLFLName("Jacket Loaded Sp", category)).toBe("loadedsp");
    expect(compactLFLName("Jacket Loaded Spicy", category)).toBe("loadedspicy");
  });
});

describe("compareLFL", () => {
  it("joins matching products and calculates delta and percent change", () => {
    const result = compareLFL(
      [item({ "Product Name": "Large Breakfast", "Quantity Sold": 100, "Value of Sales": 1000 })],
      [item({ "Product Name": "Large Breakfast", "Quantity Sold": 80, "Value of Sales": 800 })],
    );

    expect(result).toHaveLength(1);
    expect(result[0].delta.quantity).toBe(-20);
    expect(result[0].delta.valueOfSales).toBe(-200);
    expect(result[0].pct.quantity).toBeCloseTo(-20);
    expect(result[0].pct.valueOfSales).toBeCloseTo(-20);
  });

  it("keeps products that only appear in one period", () => {
    const result = compareLFL(
      [item({ "Product Name": "Old Item" })],
      [item({ "Product Name": "New Item" })],
    );

    const oldItem = result.find((row) => row.productName === "Old Item");
    const newItem = result.find((row) => row.productName === "New Item");

    expect(oldItem?.period2).toBeNull();
    expect(newItem?.period1).toBeNull();
    expect(newItem?.delta.quantity).toBe(10);
    expect(newItem?.pct.quantity).toBeNull();
  });

  it("treats same name in different sub categories as different products", () => {
    const result = compareLFL(
      [
        item({
          Category: "Extras/Options",
          "Sub Category": "Choices/Options",
          "Product Name": "BBQ Sauce",
          "Quantity Sold": 9,
          "Value of Sales": 8.91,
        }),
        item({
          Category: "Extras/Options",
          "Sub Category": "Extras",
          "Product Name": "BBQ Sauce",
          "Quantity Sold": 1,
          "Value of Sales": 0.99,
        }),
      ],
      [
        item({
          Category: "Extras/Options",
          "Sub Category": "Choices/Options",
          "Product Name": "BBQ Sauce",
          "Quantity Sold": 4,
          "Value of Sales": 4,
        }),
      ],
    );

    expect(result).toHaveLength(2);
    expect(
      productKey({
        Category: "Extras/Options",
        "Sub Category": "Choices/Options",
        "Product Name": "BBQ Sauce",
      }),
    ).not.toBe(
      productKey({
        Category: "Extras/Options",
        "Sub Category": "Extras",
        "Product Name": "BBQ Sauce",
      }),
    );

    const extras = result.find((row) => row.subCategory === "Extras");
    expect(extras?.period2).toBeNull();
    expect(extras?.delta.quantity).toBe(-1);
  });

  it("returns null percent change when period 1 is zero", () => {
    const [row] = compareLFL(
      [item({ "Product Name": "New Dish", "Quantity Sold": 0, "Value of Sales": 0 })],
      [item({ "Product Name": "New Dish", "Quantity Sold": 2, "Value of Sales": 5 })],
    );

    expect(row.pct.valueOfSales).toBeNull();
    expect(row.delta.valueOfSales).toBe(5);
  });

  it("returns -100% when a product drops to zero instead of Infinity", () => {
    const [row] = compareLFL(
      [item({ "Product Name": "VEGAN Butty", "Quantity Sold": 1, "Value of Sales": 2.99 })],
      [item({ "Product Name": "VEGAN Butty", "Quantity Sold": 0, "Value of Sales": 0 })],
    );

    expect(row.delta.quantity).toBe(-1);
    expect(row.pct.quantity).toBe(-100);
    expect(Number.isFinite(row.pct.quantity)).toBe(true);
  });

  it("merges products renamed with an ST suffix", () => {
    const result = compareLFL(
      [
        item({
          Category: "Burgers",
          "Sub Category": "Burgers",
          "Product Name": "Beef Big Smoke",
          "Quantity Sold": 90,
          "Value of Sales": 400,
        }),
      ],
      [
        item({
          Category: "Burgers",
          "Sub Category": "Burgers",
          "Product Name": "Beef Big SmokeST",
          "Quantity Sold": 105,
          "Value of Sales": 497.58,
        }),
      ],
    );

    expect(result).toHaveLength(1);
    expect(result[0].productName).toBe("Beef Big SmokeST");
    expect(result[0].period1?.quantity).toBe(90);
    expect(result[0].period2?.quantity).toBe(105);
    expect(result[0].delta.quantity).toBe(15);
  });

  it("does not treat Breakfast as matching BreakfaST", () => {
    const result = compareLFL(
      [item({ "Product Name": "Breakfast" })],
      [item({ "Product Name": "Large Breakfast" })],
    );

    expect(result).toHaveLength(2);
  });

  it("sums ST and non-ST variants in the same period", () => {
    const result = compareLFL(
      [
        item({
          Category: "Burgers",
          "Sub Category": "Burgers",
          "Product Name": "Beef Classic",
          "Quantity Sold": 10,
          "Value of Sales": 80,
        }),
        item({
          Category: "Burgers",
          "Sub Category": "Burgers",
          "Product Name": "Beef Classic ST",
          "Quantity Sold": 5,
          "Value of Sales": 40,
        }),
      ],
      [
        item({
          Category: "Burgers",
          "Sub Category": "Burgers",
          "Product Name": "Beef Classic ST",
          "Quantity Sold": 20,
          "Value of Sales": 160,
        }),
      ],
    );

    expect(result).toHaveLength(1);
    expect(result[0].period1?.quantity).toBe(15);
    expect(result[0].period2?.quantity).toBe(20);
  });

  it("merges spaced, squeezed and truncated POS names", () => {
    const pairs = [
      { category: "Burgers", sub: "Burgers", oldName: "UltimateBurger", newName: "Ultimate BurgeST" },
      { category: "Burgers", sub: "Burgers", oldName: "AmericanBurg", newName: "American BurgST" },
      { category: "Main Meals", sub: "Value Meals", oldName: "Ham Egg & Chips", newName: "Ham Egg& ChipsST" },
      { category: "Main Meals", sub: "Main Meals", oldName: "Sml HB Cod &Chip", newName: "Sml HB Cod&ChiAC" },
      { category: "Main Meals", sub: "Main Meals", oldName: "Steak & Ale Pud", newName: "Steak&Ale PuddST" },
      { category: "Burgers", sub: "Burgers", oldName: "Halloumi Burger", newName: "Halloumi BurgeST" },
      { category: "Burgers", sub: "Burgers", oldName: "The Empire Stack", newName: "The Empire StaST" },
    ] as const;

    pairs.forEach(({ category, sub, oldName, newName }) => {
      const result = compareLFL(
        [
          item({
            Category: category,
            "Sub Category": sub,
            "Product Name": oldName,
            "Quantity Sold": 10,
          }),
        ],
        [
          item({
            Category: category,
            "Sub Category": sub,
            "Product Name": newName,
            "Quantity Sold": 12,
          }),
        ],
      );

      expect(result, `${oldName} → ${newName}`).toHaveLength(1);
      expect(result[0].period1?.quantity).toBe(10);
      expect(result[0].period2?.quantity).toBe(12);
    });
  });

  it("merges jacket potato naming variants", () => {
    const pairs = [
      ["Extra Tuna Jacket", "Extra Tuna Jkt"],
      ["Beans Jacket", "Jacket Beans"],
      ["Cheese Jacket", "Jacket Cheese"],
      ["Coleslaw Jacket", "Jacket Coleslaw"],
      ["Jacket Med Veg", "Jacket MedVeg"],
      ["Jacket Non Carne", "Jacket NonCarne"],
      ["Tuna Jacket", "Jacket Tuna"],
      ["Jacket Smoky Beans", "Jacket SmokyB"],
      ["Jacket Loaded Spicy", "Jacket Loaded Sp"],
      ["Mexican Jacket", "Jacket Mexican"],
    ] as const;

    pairs.forEach(([oldName, newName]) => {
      const result = compareLFL(
        [
          item({
            Category: "Jacket Potatoes",
            "Sub Category": "Jacket Potato",
            "Product Name": oldName,
            "Quantity Sold": 8,
          }),
        ],
        [
          item({
            Category: "Jacket Potatoes",
            "Sub Category": "Jacket Potato",
            "Product Name": newName,
            "Quantity Sold": 11,
          }),
        ],
      );

      expect(result, `${oldName} → ${newName}`).toHaveLength(1);
      expect(result[0].period1?.quantity).toBe(8);
      expect(result[0].period2?.quantity).toBe(11);
    });
  });

  it("does not merge extra tuna topping with tuna jacket", () => {
    const result = compareLFL(
      [
        item({
          Category: "Jacket Potatoes",
          "Sub Category": "Jacket Potato",
          "Product Name": "Jacket Tuna",
        }),
      ],
      [
        item({
          Category: "Jacket Potatoes",
          "Sub Category": "Jacket Potato",
          "Product Name": "Extra Tuna Jkt",
        }),
      ],
    );

    expect(result).toHaveLength(2);
  });

  it("does not merge unrelated names that only share a prefix", () => {
    const result = compareLFL(
      [item({ "Product Name": "Toast" })],
      [item({ "Product Name": "Toast & Preserve" })],
    );

    expect(result).toHaveLength(2);
  });
});

describe("aggregateComparedRows", () => {
  it("sums selected products and recalculates percent from totals", () => {
    const rows = compareLFL(
      [
        item({ "Product Name": "Toast", "Quantity Sold": 10, "Value of Sales": 20 }),
        item({ "Product Name": "Bacon Butty", "Quantity Sold": 10, "Value of Sales": 80 }),
      ],
      [
        item({ "Product Name": "Toast", "Quantity Sold": 15, "Value of Sales": 30 }),
        item({ "Product Name": "Bacon Butty", "Quantity Sold": 5, "Value of Sales": 40 }),
      ],
    );

    const total = aggregateComparedRows(rows, {
      key: "total",
      productName: "Total",
      category: "All",
    });

    expect(total.period1?.quantity).toBe(20);
    expect(total.period2?.quantity).toBe(20);
    expect(total.delta.valueOfSales).toBe(-30);
    expect(total.pct.valueOfSales).toBeCloseTo(-30);
  });
});

describe("aggregateLFLByCategory", () => {
  it("rolls products up to category totals", () => {
    const rows = compareLFL(
      [
        item({ Category: "Breakfasts", "Product Name": "Toast", "Value of Sales": 20 }),
        item({
          Category: "Burgers",
          "Sub Category": "Burgers",
          "Product Name": "Classic",
          "Value of Sales": 50,
        }),
      ],
      [
        item({ Category: "Breakfasts", "Product Name": "Toast", "Value of Sales": 30 }),
        item({
          Category: "Burgers",
          "Sub Category": "Burgers",
          "Product Name": "Classic",
          "Value of Sales": 40,
        }),
      ],
    );

    const categories = aggregateLFLByCategory(rows);
    expect(categories.map((row) => row.productName)).toEqual(["Breakfasts", "Burgers"]);
    expect(categories[0].delta.valueOfSales).toBe(10);
    expect(categories[1].delta.valueOfSales).toBe(-10);
  });
});
