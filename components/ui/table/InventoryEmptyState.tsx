import React from "react";

type InventoryEmptyStateProps = {
  message?: string;
  colSpan?: number;
};

const InventoryEmptyState = ({
  message,
  colSpan,
}: InventoryEmptyStateProps) => {
  return (
    <tr>
      <td
        colSpan={colSpan ?? 1}
        className="bg-white px-5 py-12 text-center text-[13px] text-slate-500"
      >
        {message}
      </td>
    </tr>
  );
};

export default InventoryEmptyState;
