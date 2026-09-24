"use client";

import type { ReactNode } from "react";

import InventoryEmptyState from "./InventoryEmptyState";

export type InventoryTableColumn<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  render: (item: T) => ReactNode;
};

type InventoryTableProps<T> = {
  items: T[];
  columns: InventoryTableColumn<T>[];
  getRowKey: (item: T) => string;
  getRowClassName?: (item: T) => string;
  onRowClick?: (item: T) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  emptyMessage: string;
};

const InventoryTable = <T,>({
  items,
  columns,
  getRowKey,
  getRowClassName,
  onRowClick,
  sortKey,
  sortDirection,
  onSort,
  emptyMessage,
}: InventoryTableProps<T>) => {
  return (
    <table className="inventory-table w-full border-separate border-spacing-0">
      <thead className="sticky top-0 z-10">
        <tr className="bg-slate-50">
          {columns.map((column) => {
            const isActiveSort = column.key === sortKey;
            const isSortable =
              column.sortable === true && typeof onSort === "function";

            return (
              <th
                key={column.key}
                className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-500 first:pl-5 last:pr-5"
              >
                {isSortable ? (
                  <button
                    type="button"
                    onClick={() => onSort(column.key)}
                    className="flex cursor-pointer items-center gap-1.5 transition hover:text-slate-900"
                  >
                    <span>{column.label}</span>

                    {isActiveSort && (
                      <span className="text-[10px] text-slate-400">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                ) : (
                  column.label
                )}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr
            key={getRowKey(item)}
            onClick={() => onRowClick?.(item)}
            className={`transition ${onRowClick ? "cursor-pointer" : ""} ${
              getRowClassName?.(item) ?? "bg-white hover:bg-slate-50"
            }`}
          >
            {columns.map((column) => (
              <td
                key={column.key}
                className="border-b border-slate-100 px-4 py-4 first:pl-5 last:pr-5"
              >
                {column.render(item)}
              </td>
            ))}
          </tr>
        ))}

        {items.length === 0 && (
          <InventoryEmptyState
            colSpan={columns.length}
            message={emptyMessage}
          />
        )}
      </tbody>
    </table>
  );
};

export default InventoryTable;
