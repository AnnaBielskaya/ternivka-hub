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
  const [needsRefillOnly, setNeedsRefillOnly] = useState(false);
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

        case "status":
          comparison = Number(a.needsRefill) - Number(b.needsRefill);
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return needsRefillOnly
      ? sortedItems.filter((item) => item.needsRefill)
      : sortedItems;
  }, [items, needsRefillOnly, sortKey, sortDirection]);

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
        refillOnly={needsRefillOnly}
        onRefillChange={setNeedsRefillOnly}
      />

      <div className="overflow-x-auto rounded-lg bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="max-h-[calc(100vh-260px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="inventory-table w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50">
                {MEDICINE_TABLE_COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    className="border-b border-slate-200 px-4 py-3 text-left text-[13px] font-semibold text-slate-500 first:pl-5 last:pr-5"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => {
                const needsRefill = item.needsRefill;

                return (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className={`cursor-pointer transition ${
                      needsRefill
                        ? "bg-red-50 hover:bg-red-100/70"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <td
                      className={`border-b border-slate-100 px-4 py-4 first:pl-5 ${
                        needsRefill ? "text-red-700" : "text-slate-900"
                      }`}
                    >
                      <div className="max-w-[240px] min-w-0">
                        <p className="font-medium leading-5">{item.name}</p>

                        {item.description && (
                          <p
                            className={`mt-1 line-clamp-2 max-w-[220px] text-[13px] italic leading-4 ${
                              needsRefill ? "text-red-400" : "text-slate-400"
                            }`}
                          >
                            {item.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4">
                      {item.medicine_form ? (
                        <StatusBadge
                          kind="form"
                          variant={needsRefill ? "warning" : "info"}
                          title={item.medicine_form.name}
                        />
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td
                      className={`border-b border-slate-100 px-4 py-4 text-[13px] font-medium ${
                        needsRefill ? "text-red-700" : "text-slate-800"
                      }`}
                    >
                      {item.active_ingredient ?? "-"}
                    </td>

                    <td
                      className={`border-b border-slate-100 px-4 py-4 text-[13px] ${
                        needsRefill ? "text-red-700" : "text-slate-600"
                      }`}
                    >
                      {item.dosage ?? "-"}
                    </td>

                    <td
                      className={`border-b border-slate-100 px-4 py-4 text-[13px] ${
                        needsRefill ? "text-red-700" : "text-slate-600"
                      }`}
                    >
                      {item.volume ?? "-"}
                    </td>

                    <td
                      className={`whitespace-nowrap border-b border-slate-100 px-4 py-4 text-[13px] font-medium ${
                        needsRefill ? "text-red-700" : "text-slate-800"
                      }`}
                    >
                      {item.quantity} ({item.unit})
                    </td>

                    <td
                      className={`whitespace-nowrap border-b border-slate-100 px-4 py-4 text-[13px] ${
                        needsRefill ? "text-red-700" : "text-slate-600"
                      }`}
                    >
                      {item.nearestExpiry ?? "-"}
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4 last:pr-5">
                      <StatusBadge
                        variant={needsRefill ? "warning" : "success"}
                        title={
                          needsRefill ? "Потребує поповнення" : "Достатньо"
                        }
                      />
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan={MEDICINE_TABLE_COLUMNS.length}
                    className="bg-white px-5 py-12 text-center text-[13px] text-slate-500"
                  >
                    {needsRefillOnly
                      ? "Препаратів, що потребують поповнення, немає"
                      : "Препаратів немає"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
