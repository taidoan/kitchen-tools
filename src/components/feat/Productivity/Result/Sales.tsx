import clsx from "clsx";

type SalesProps = {
  sales: number | null;
  salesForecast: number | null;
};

export const SalesComponent = ({ sales, salesForecast }: SalesProps) => {
  if (sales === null || salesForecast === null) return null;

  const salesDifference = Math.abs(sales - salesForecast);
  const percentageDifference = (
    (salesDifference / salesForecast) *
    100
  ).toFixed(1);
  const isBelowTarget = sales < salesForecast;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <p>
      We&apos;ve taken <strong>£{formatCurrency(sales)}</strong> in food sales
      this week. This was <strong>£{formatCurrency(salesDifference)}</strong>{" "}
      <span
        className={clsx(
          isBelowTarget ? "text-clr--failed" : "text-clr--success",
          "text--small"
        )}
      >
        {isBelowTarget
          ? `(-${percentageDifference}%)`
          : `(+${percentageDifference}%)`}
      </span>
      {isBelowTarget ? " below" : " above"} the target of{" "}
      <strong>£{formatCurrency(salesForecast)}</strong>.
    </p>
  );
};
