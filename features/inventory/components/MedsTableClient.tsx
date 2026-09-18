"use client";

import { useMemo, useState } from "react";

import type { InventoryItem } from "@/features/inventory/types";
import { MEDICINE_TABLE_COLUMNS } from "../constants";
import MedsToolbar from "./MedsToolbar";

type MedsTableClientProps = {
  items: InventoryItem[];
};

const MedsTableClient = ({ items }: MedsTableClientProps) => {
  const [refillOnly, setRefillOnly] = useState(false);

  const filteredItems = useMemo(() => {
    if (!refillOnly) {
      return items;
    }

    return items.filter((item) => item.refill_required);
  }, [items, refillOnly]);

  return (
    <>
      <MedsToolbar refillOnly={refillOnly} onRefillChange={setRefillOnly} />

      <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
        <table className="inventory-table">
          <thead>
            <tr className="inventory-table-head">
              {MEDICINE_TABLE_COLUMNS.map((column) => (
                <th key={column.key} className="inventory-table-head-cell">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => {
              const isRefillRequired = item.refill_required;

              return (
                <tr
                  key={item.id}
                  className={`cursor-pointer border-b border-gray-100 last:border-0 transition ${
                    isRefillRequired
                      ? "bg-red-50 hover:bg-red-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td
                    className={`inventory-table-cell-bordered font-medium ${
                      isRefillRequired
                        ? "bg-red-50 text-red-700"
                        : "text-gray-900"
                    }`}
                  >
                    {item.name}
                  </td>

                  <td
                    className={`inventory-table-cell-bordered ${
                      isRefillRequired ? "bg-red-50" : ""
                    }`}
                  >
                    {item.category ? (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          isRefillRequired
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.category.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  <td
                    className={`inventory-table-cell-bordered font-medium ${
                      isRefillRequired
                        ? "bg-red-50 text-red-700"
                        : "text-gray-900"
                    }`}
                  >
                    {item.active_ingredient ?? "-"}
                  </td>

                  <td
                    className={`inventory-table-cell-bordered ${
                      isRefillRequired
                        ? "bg-red-50 text-red-700"
                        : "text-gray-600"
                    }`}
                  >
                    {item.dosage ?? "-"}
                  </td>

                  <td
                    className={`inventory-table-cell-bordered ${
                      isRefillRequired
                        ? "bg-red-50 text-red-700"
                        : "text-gray-600"
                    }`}
                  >
                    {item.volume ?? "-"}
                  </td>

                  <td
                    className={`inventory-table-cell-bordered ${
                      isRefillRequired
                        ? "bg-red-50 text-red-700"
                        : "text-gray-600"
                    }`}
                  >
                    {item.unit}
                  </td>

                  <td
                    className={`inventory-table-cell text-xs font-medium ${
                      isRefillRequired
                        ? "bg-red-50 text-red-700"
                        : "text-gray-900"
                    }`}
                  >
                    {item.quantity}
                  </td>

                  <td
                    className={`inventory-table-cell text-xs ${
                      isRefillRequired
                        ? "bg-red-50 text-red-700"
                        : "text-gray-600"
                    }`}
                  >
                    {item.nearestExpiry ?? "-"}
                  </td>

                  <td
                    className={`inventory-table-cell ${
                      isRefillRequired ? "bg-red-50" : ""
                    }`}
                  >
                    {isRefillRequired ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                        <span className="text-[10px] leading-none">⚠️</span>
                        Треба поповнити
                      </span>
                    ) : (
                      <span
                        className={
                          item.isLow
                            ? "inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
                            : "inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600"
                        }
                      >
                        {item.isLow ? "Мало" : "Достатньо"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}

            {filteredItems.length === 0 && (
              <tr>
                <td
                  colSpan={MEDICINE_TABLE_COLUMNS.length}
                  className="px-5 py-10 text-center text-sm text-gray-500"
                >
                  Препаратів немає
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MedsTableClient;
