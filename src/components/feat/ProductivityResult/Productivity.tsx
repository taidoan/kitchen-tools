import type { ProductivityData } from "@/app/productivity/types";

type ProductivityComponentProps = {
  productivity: ProductivityData | null;
  prepTarget: number;
  lateTarget: number;
};

export const ProductivityComponent = ({
  productivity,
  prepTarget,
  lateTarget,
}: ProductivityComponentProps) => {
  return (
    <table>
      <thead>
        <tr>
          {[
            "Name",
            "Prep Time",
            "Orders",
            "Items",
            "Late Orders",
            "Longest Order",
            "Hours Worked",
          ].map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {productivity?.staffMembers.map((member) => {
          return (
            <tr key={member.name}>
              <td>{member.name}</td>
              <td data-cell="Prep Time: ">{member.prepTime}</td>
              <td data-cell="Orders: ">{member.orders}</td>
              <td data-cell="Items: ">{member.items}</td>
              <td data-cell="Late Orders: ">
                {member.lateOrders}{" "}
                <span className="text-sm">
                  ({member.lateOrdersPercentage}%)
                </span>
              </td>
              <td data-cell="Longest Order: ">{member.longestOrder}</td>
              <td data-cell="Hours Worked: ">{member.hoursWorked}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
