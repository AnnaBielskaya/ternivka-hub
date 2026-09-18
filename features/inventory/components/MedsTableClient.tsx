"use client";

import { useState } from "react";

import type { InventoryItem } from "@/features/inventory/types";
import { MEDICINE_TABLE_COLUMNS } from "../constants";
import MedsToolbar from "./MedsToolbar";

type MedsTableClientProps = {
  items: InventoryItem[];
};

const MedsTableClient = ({ items }: MedsTableClientProps) => {
  const [refillOnly, setRefillOnly] = useState(false);

  const filteredItems = refillOnly
    ? items.filter((item) => item.refill_required)
    : items;

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

              const rowClassName = isRefillRequired
                ? "bg-red-50 hover:bg-red-100"
                : "hover:bg-gray-50";

              const primaryTextClassName = isRefillRequired
                ? "text-red-700"
                : "text-gray-900";

              const secondaryTextClassName = isRefillRequired
                ? "text-red-700"
                : "text-gray-600";

              return (
                <tr
                  key={item.id}
                  className={`cursor-pointer border-b border-gray-100 last:border-0 transition ${rowClassName}`}
                >
                  <td
                    className={`inventory-table-cell-bordered font-medium ${primaryTextClassName}`}
                  >
                    {item.name}
                  </td>

                  <td className="inventory-table-cell-bordered">
                    {item.medicine_form ? (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          isRefillRequired
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.medicine_form.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  <td
                    className={`inventory-table-cell-bordered font-medium ${primaryTextClassName}`}
                  >
                    {item.active_ingredient ?? "-"}
                  </td>

                  <td
                    className={`inventory-table-cell-bordered ${secondaryTextClassName}`}
                  >
                    {item.dosage ?? "-"}
                  </td>

                  <td
                    className={`inventory-table-cell-bordered ${secondaryTextClassName}`}
                  >
                    {item.volume ?? "-"}
                  </td>

                  <td
                    className={`inventory-table-cell-bordered ${secondaryTextClassName}`}
                  >
                    {item.unit}
                  </td>

                  <td
                    className={`inventory-table-cell text-xs font-medium ${primaryTextClassName}`}
                  >
                    {item.quantity}
                  </td>

                  <td
                    className={`inventory-table-cell text-xs ${secondaryTextClassName}`}
                  >
                    {item.nearestExpiry ?? "-"}
                  </td>

                  <td className="inventory-table-cell">
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
                  {refillOnly
                    ? "Препаратів, що потребують поповнення, немає"
                    : "Препаратів немає"}
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
