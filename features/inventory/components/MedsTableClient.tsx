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
import InventoryCard from "@/components/ui/table/InventoryCard";
import InventoryEmptyState from "@/components/ui/table/InventoryEmptyState";
import { UserRole } from "@/features/users/types";

type MedsTableClientProps = {
  items: InventoryItem[];
  role: UserRole;
  medicineForms: MedicineFormRow[];
  medicinePurposes: MedicinePurposeRow[];
};

const collator = new Intl.Collator("uk-UA", {
  sensitivity: "base",
});

const MedsTableClient = ({
  items,
  role,
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

  const [selectedForm, setSelectedForm] = useState<string | null>(null);

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
    const filtered = items.filter((item) => {
      if (!selectedForm) {
        return true;
      }

      return item.medicine_form?.name === selectedForm;
    });

    const sortedItems = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case "name":
          comparison = collator.compare(a.name, b.name);
          break;

        case "dosage":
          comparison = collator.compare(a.dosage ?? "", b.dosage ?? "");
          break;

        case "active_ingredient":
          comparison = collator.compare(
            a.active_ingredient ?? "",
            b.active_ingredient ?? ""
          );
          break;

        case "medicine_form":
          comparison = collator.compare(
            a.medicine_form?.name ?? "",
            b.medicine_form?.name ?? ""
          );
          break;

        case "volume":
          comparison = collator.compare(a.volume ?? "", b.volume ?? "");
          break;

        case "quantity":
          comparison = Number(a.quantity) - Number(b.quantity);
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
  }, [items, selectedForm, needsRefillOnly, sortKey, sortDirection]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 shrink-0">
        <MedsToolbar
          selectedForm={selectedForm}
          onFormChange={setSelectedForm}
          refillOnly={needsRefillOnly}
          onRefillChange={setNeedsRefillOnly}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:rounded-md lg:border lg:border-slate-200">
        <div className="lg:hidden">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {filteredItems.map((item) => {
                const needsRefill = item.needsRefill;

                return (
                  <InventoryCard
                    key={item.id}
                    title={item.name}
                    description={item.description}
                    badge={
                      <StatusBadge
                        kind="form"
                        variant={needsRefill ? "warning" : "info"}
                        title={item.medicine_form?.name ?? "—"}
                      />
                    }
                    fields={[
                      {
                        label: "Діюча речовина",
                        value: item.active_ingredient ?? "—",
                      },
                      {
                        label: "Дозування",
                        value: item.dosage ?? "—",
                      },
                      {
                        label: "Обʼєм",
                        value: item.volume ?? "—",
                      },
                      {
                        label: "Термін придатності",
                        value: item.nearestExpiry ?? "—",
                      },
                    ]}
                    quantity={item.quantity}
                    quantityUnit={item.unit}
                    status={{
                      title: needsRefill ? "Потребує поповнення" : "Достатньо",
                      variant: needsRefill ? "warning" : "success",
                    }}
                    highlighted={needsRefill}
                    disabled={isDeleting}
                    onClick={() => handleRowClick(item)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="px-5 py-12 text-center text-[13px] text-slate-500">
              {needsRefillOnly
                ? "Препаратів, що потребують поповнення, немає"
                : "Препаратів немає"}
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <table className="inventory-table w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50">
                {MEDICINE_TABLE_COLUMNS.map((column) => {
                  const isActiveSort = column.key === sortKey;

                  return (
                    <th
                      key={column.key}
                      className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-500 first:pl-5 last:pr-5"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleSortChange(column.key as MedicineSortKey)
                        }
                        className="flex cursor-pointer items-center gap-1.5 transition hover:text-slate-900"
                      >
                        <span>{column.label}</span>

                        {isActiveSort && (
                          <span className="text-[10px] text-slate-400">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                  );
                })}
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
                <InventoryEmptyState
                  colSpan={MEDICINE_TABLE_COLUMNS.length}
                  message="Препаратів немає"
                />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItem && (
        <MedicineDetailsModal
          item={selectedItem}
          role={role}
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
    </div>
  );
};

export default MedsTableClient;
