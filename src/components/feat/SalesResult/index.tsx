import type { SalesResult } from "@/app/sales/types";
import { Divider } from "@/components/ui/Divider";
import clsx from "clsx";

type SalesResultProps = {
  resultData: SalesResult;
};

export const SalesResultComponent = ({ resultData }: SalesResultProps) => {
  return (
    <div className={clsx("sales__result", "sales__print")}>
      <div className="sales__quantity">
        <h3 className="sales__title">
          Top {resultData.topQuantity.length} by Quantity
        </h3>
        <Divider className="sales__divider" />
        <p>
          These are the top {resultData.topQuantity.length} products sold by
          quantity.
        </p>
        <table className="sales__table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {resultData.topQuantity.map((item, index) => (
              <tr key={index}>
                <td>{item["Product Name"]}</td>
                <td>{item["Quantity Sold"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sales__value">
        <h3 className="sales__title">
          Top {resultData.topSales.length} by Sales
        </h3>
        <Divider className="sales__divider" />
        <p>
          These are the top {resultData.topSales.length} products sold by value
          of sales.
        </p>
        <table className="sales__table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Sales</th>
            </tr>
          </thead>
          <tbody>
            {resultData.topSales.map((item, index) => (
              <tr key={index}>
                <td>{item["Product Name"]}</td>
                <td>{item["Value of Sales"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
