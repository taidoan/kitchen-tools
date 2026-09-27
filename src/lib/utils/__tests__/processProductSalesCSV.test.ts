import { describe, expect, it } from "vitest";
import { processProductSalesCSV } from "../csv";

const csv = `Product Division	Category	Sub Category	Destination	Product Name	Portion	Quantity Sold	Value of Sales	Net Value of Sales	% of Total Sales	% of Division	% of Category	% of Sub-Cat	Gross Sales	Discount	Promotion	Tax
Food	Breakfasts	Breakfast	Standard	Large Breakfast	Standard	327	2016	1679.88	5.93	5.93	25.44	25.44	2198.23	182.23	0	336.12
Food	Breakfasts	Breakfast	Standard	VEGAN Butty	Standard	1	0	0	0	0	0	0	2.99	2.99	0	0
				SubTotal		328	2016	1679.88	5.93	5.93		100	2201.22	185.22	0	336.12
		Category Total				328	2016	1679.88	5.93	5.93	100		2201.22	185.22	0	336.12
Food	Extras/Options	Choices/Options	Standard	BBQ Sauce	Standard	9	8.91	7.42	0.03	0.03	3.29	7.37	8.91	0	0	1.49
Food	Extras/Options	Extras	Standard	BBQ Sauce	Standard	1	0.99	0.82	0	0	0.37	0.66	0.99	0	0	0.17
	Division Total					338	2025.9	1688.12	100	100			2211.12	185.22	0	337.78
Total						338	2025.9	1688.12	100	100			2211.12	185.22	0	337.78`;

describe("processProductSalesCSV", () => {
  it("keeps zero-sales products and drops summary rows", () => {
    const { items } = processProductSalesCSV(csv);
    const names = items.map((item) => item["Product Name"]);

    expect(names).toContain("VEGAN Butty");
    expect(names).toContain("Large Breakfast");
    expect(names.some((name) => /subtotal|total/i.test(name))).toBe(false);
    expect(items.find((item) => item["Product Name"] === "VEGAN Butty")?.["Value of Sales"]).toBe(0);
  });

  it("keeps sub category so duplicate names stay distinct", () => {
    const { items } = processProductSalesCSV(csv);
    const sauces = items.filter((item) => item["Product Name"] === "BBQ Sauce");

    expect(sauces).toHaveLength(2);
    expect(sauces.map((item) => item["Sub Category"]).sort()).toEqual([
      "Choices/Options",
      "Extras",
    ]);
  });

  it("groups items by category", () => {
    const { categories } = processProductSalesCSV(csv);
    expect(Object.keys(categories).sort()).toEqual(["Breakfasts", "Extras/Options"]);
    expect(categories.Breakfasts).toHaveLength(2);
  });
});
