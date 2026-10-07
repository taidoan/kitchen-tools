import { describe, expect, it } from "vitest";
import {
  processProductSalesCSV,
  spreadsheetFileToPasteText,
  toTabSeparatedText,
} from "../csv";

const tsv = `Product Division	Category	Sub Category	Destination	Product Name	Portion	Quantity Sold	Value of Sales	Net Value of Sales	% of Total Sales	% of Division	% of Category	% of Sub-Cat	Gross Sales	Discount	Promotion	Tax
Food	Breakfasts	Breakfast	Standard	Large Breakfast	Standard	327	2016	1679.88	5.93	5.93	25.44	25.44	2198.23	182.23	0	336.12`;

const quotedCsv = `"Product Division","Category","Sub Category","Destination","Product Name","Portion","Quantity Sold","Value of Sales","Net Value of Sales","% of Total Sales","% of Division","% of Category","% of Sub-Cat","Gross Sales","Discount","Promotion","Tax"
"Food","Breakfasts","Breakfast","Standard","Ham, Egg & Chips","Standard","12","1,234.50","1,000.00","5.93","5.93","25.44","25.44","1,234.50","0","0","0"`;

describe("spreadsheetFileToPasteText", () => {
  it("turns quoted Excel CSV into tab-separated text like an Excel copy", () => {
    const paste = spreadsheetFileToPasteText(new TextEncoder().encode(quotedCsv));

    expect(paste).not.toContain('"');
    expect(paste.split("\n")[0].split("\t")[4]).toBe("Product Name");
    expect(paste.split("\n")[1].split("\t")[4]).toBe("Ham, Egg & Chips");
    expect(paste.split("\n")[1].split("\t")[7]).toBe("1,234.50");
  });

  it("keeps tab-separated Excel copies unchanged", () => {
    const paste = spreadsheetFileToPasteText(new TextEncoder().encode(tsv));

    expect(paste).toBe(toTabSeparatedText(tsv.split("\n").map((line) => line.split("\t"))));
  });

  it("parses uploaded CSV the same way as a pasted TSV for LFL", () => {
    const csv = tsv
      .split("\n")
      .map((line) =>
        line
          .split("\t")
          .map((cell) => `"${cell.replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\r\n");

    const fromPaste = processProductSalesCSV(tsv);
    const fromUpload = processProductSalesCSV(
      spreadsheetFileToPasteText(new TextEncoder().encode(csv)),
    );

    expect(fromUpload.items).toEqual(fromPaste.items);
  });
});
