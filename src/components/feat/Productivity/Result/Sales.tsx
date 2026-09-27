import clsx from "clsx";

type SalesProps = {
  sales: number | null;
  salesForecast: number | null;
};

export const SalesComponent = ({
  sales,
  salesForecast,
}: SalesProps) => {
  if (sales === null || salesForecast === null) return null;

  const salesDifference = Math.abs(sales - salesForecast);
  const percentageDifference =
    salesForecast === 0
      ? null
      : ((salesDifference / salesForecast) * 100).toFixed(1);
  const isBelowTarget = sales < salesForecast;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <p>
      Food sales were{" "}
      <strong>£{formatCurrency(sales)}</strong>
      {salesForecast === 0 ? (
        "."
      ) : (
        <>
          . That is <strong>£{formatCurrency(salesDifference)}</strong>{" "}
          <span
            className={clsx(
              isBelowTarget ? "text-clr--failed" : "text-clr--success",
              "text--small"
            )}
          >
            {percentageDifference
              ? isBelowTarget
                ? `(-${percentageDifference}%)`
                : `(+${percentageDifference}%)`
              : null}
          </span>
          {isBelowTarget ? " below" : " above"} a target of{" "}
          <strong>£{formatCurrency(salesForecast)}</strong>.
        </>
      )}
    </p>
  );
};
