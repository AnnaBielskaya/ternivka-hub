"use client";

import { useMemo, useState } from "react";

import type {
  InventoryItem,
  MedicineSortKey,
  SortDirection,
  StockRow,
} from "@/features/inventory/types";

import { MEDICINE_TABLE_COLUMNS } from "../constants";
import MedsToolbar from "./MedsToolbar";
import MedicineDetailsModal from "./MedicineDetailsModal";
import StatusBadge from "@/components/ui/StatusBadge";

type MedsTableClientProps = {
  items: InventoryItem[];
};

const collator = new Intl.Collator("uk-UA", {
  sensitivity: "base",
});

const MedsTableClient = ({ items }: MedsTableClientProps) => {
  const [refillOnly, setRefillOnly] = useState(false);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const [sortKey, setSortKey] = useState<MedicineSortKey>("name");

  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleRowClick = (item: InventoryItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleSortChange = (key: MedicineSortKey) => {
    if (key === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));

      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  };

  const filteredItems = useMemo(() => {
    const sortedItems = [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case "name":
          comparison = collator.compare(a.name, b.name);
          break;

        case "active_ingredient":
          comparison = collator.compare(
            a.active_ingredient ?? "",
            b.active_ingredient ?? ""
          );
          break;

        case "nearestExpiry":
          comparison =
            (a.nearestExpirySortKey ?? Infinity) -
            (b.nearestExpirySortKey ?? Infinity);
          break;

        case "status": {
          const getStatusPriority = (item: InventoryItem) => {
            if (item.refill_required) {
              return 0;
            }

            if (item.isLow) {
              return 1;
            }

            return 2;
          };

          comparison = getStatusPriority(a) - getStatusPriority(b);

          break;
        }
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    if (!refillOnly) {
      return sortedItems;
    }

    return sortedItems.filter((item) => item.refill_required);
  }, [items, refillOnly, sortKey, sortDirection]);

  /*
   * Тимчасовий stock.
   *
   * Пізніше він прийде з БД разом
   * із конкретним препаратом.
   */
  const mockStock: StockRow[] = selectedItem
    ? selectedItem.nearestExpiry
      ? [
          {
            id: `${selectedItem.id}-stock`,
            expiry_month: Number(selectedItem.nearestExpiry.split("/")[0]),
            expiry_year: Number(selectedItem.nearestExpiry.split("/")[1]),
            quantity: selectedItem.quantity,
          },
        ]
      : []
    : [];

  return (
    <>
      <MedsToolbar
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        refillOnly={refillOnly}
        onRefillChange={setRefillOnly}
      />

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
                  onClick={() => handleRowClick(item)}
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
                    {isRefillRequired && (
                      <StatusBadge variant="warning" title="Треба поповнити" />
                    )}

                    {!isRefillRequired && item.isLow && (
                      <StatusBadge variant="danger" title="Мало" />
                    )}

                    {!isRefillRequired && !item.isLow && (
                      <StatusBadge variant="success" title="Достатньо" />
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

      {selectedItem && (
        <MedicineDetailsModal
          item={selectedItem}
          stock={mockStock}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default MedsTableClient;
