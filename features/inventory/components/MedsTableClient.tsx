"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type {
  InventoryItem,
  MedicineFormRow,
  MedicinePurposeRow,
  MedicineSortKey,
  SortDirection,
} from "@/features/inventory/types";

import { MEDICINE_TABLE_COLUMNS } from "../constants";
import { deleteMedicine } from "../actions/delete-medicine";

import MedsToolbar from "./MedsToolbar";
import MedicineDetailsModal from "./MedicineDetailsModal";
import EditMedicineModal from "./EditMedicineModal";
import StatusBadge from "@/components/ui/StatusBadge";

type MedsTableClientProps = {
  items: InventoryItem[];
  medicineForms: MedicineFormRow[];
  medicinePurposes: MedicinePurposeRow[];
};

const collator = new Intl.Collator("uk-UA", {
  sensitivity: "base",
});

const MedsTableClient = ({
  items,
  medicineForms,
  medicinePurposes,
}: MedsTableClientProps) => {
  const router = useRouter();

  const [needsRefillOnly, setNeedsRefillOnly] = useState(false);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [sortKey, setSortKey] = useState<MedicineSortKey>("name");

  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [isDeleting, startDeleting] = useTransition();

  const handleRowClick = (item: InventoryItem) => {
    if (isDeleting) {
      return;
    }

    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    if (isDeleting) {
      return;
    }

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

  const handleDelete = () => {
    if (!selectedItem) {
      return;
    }

    const medicineId = selectedItem.id;

    startDeleting(async () => {
      const result = await deleteMedicine(medicineId);

      if (result.status === "error") {
        window.alert(result.message);
        return;
      }

      setSelectedItem(null);
      router.refresh();
    });
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

  return (
    <>
      <MedsToolbar
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        refillOnly={needsRefillOnly}
        onRefillChange={setNeedsRefillOnly}
      />

      <div className="overflow-x-auto rounded-xl bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="max-h-[calc(100vh-260px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="inventory-table w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50">
                {MEDICINE_TABLE_COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-500 first:pl-5 last:pr-5"
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
                            className={`mt-1 line-clamp-2 max-w-[220px] text-xs italic leading-4 ${
                              needsRefill ? "text-red-400" : "text-slate-400"
                            }`}
                          >
                            {item.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td
                      className={`border-b border-slate-100 px-4 py-4 text-[13px] ${
                        needsRefill ? "text-red-700" : "text-slate-600"
                      }`}
                    >
                      {item.dosage ?? "-"}
                    </td>

                    <td
                      className={`border-b border-slate-100 px-4 py-4 text-[13px] font-medium ${
                        needsRefill ? "text-red-700" : "text-slate-800"
                      }`}
                    >
                      {item.active_ingredient ?? "-"}
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
          stock={selectedItem.stock}
          onClose={handleCloseModal}
          onDelete={handleDelete}
          onEdit={() => {
            setEditingItem(selectedItem);
            setSelectedItem(null);
          }}
        />
      )}

      {editingItem && (
        <EditMedicineModal
          item={editingItem}
          medicineForms={medicineForms}
          medicinePurposes={medicinePurposes}
          onClose={() => {
            setEditingItem(null);
          }}
          onSaved={() => {
            setEditingItem(null);
            router.refresh();
          }}
        />
      )}

      {isDeleting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20">
          <div className="rounded-lg bg-white px-4 py-3 text-sm font-medium text-slate-700">
            Видалення препарату...
          </div>
        </div>
      )}
    </>
  );
};

export default MedsTableClient;
