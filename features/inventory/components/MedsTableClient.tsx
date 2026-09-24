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
import { deleteMedicine } from "../medicine/actions/delete-medicine";

import MedsToolbar from "./MedsToolbar";
import MedicineDetailsModal from "./MedicineDetailsModal";
import EditMedicineModal from "./EditMedicineModal";
import StatusBadge from "@/components/ui/StatusBadge";
import InventoryCard from "@/components/ui/table/InventoryCard";
import InventoryTable from "@/components/ui/table/InventoryTable";
import { UserRole } from "@/features/users/types";
import type { InventoryTableColumn } from "@/components/ui/table/InventoryTable";
import InfoMessage from "@/components/ui/InfoMessage";

type MedsTableClientProps = {
  items: InventoryItem[];
  role: UserRole;
  medicineForms: MedicineFormRow[];
  medicinePurposes: MedicinePurposeRow[];
};

const collator = new Intl.Collator("uk-UA", {
  sensitivity: "base",
});

const medicineTableColumns: InventoryTableColumn<InventoryItem>[] =
  MEDICINE_TABLE_COLUMNS.map((column) => ({
    key: column.key,
    label: column.label,
    sortable: column.sortable,
    render: (item) => {
      const needsRefill = item.needsRefill;

      switch (column.key) {
        case "name":
          return (
            <div className="max-w-[240px] min-w-0">
              <p
                className={`font-medium leading-5 ${
                  needsRefill ? "text-red-700" : "text-slate-900"
                }`}
              >
                {item.name}
              </p>

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
          );

        case "dosage":
          return (
            <span
              className={`text-[13px] ${
                needsRefill ? "text-red-700" : "text-slate-600"
              }`}
            >
              {item.dosage ?? "-"}
            </span>
          );

        case "active_ingredient":
          return (
            <span
              className={`text-[13px] font-medium ${
                needsRefill ? "text-red-700" : "text-slate-800"
              }`}
            >
              {item.active_ingredient ?? "-"}
            </span>
          );

        case "medicine_form":
          return item.medicine_form ? (
            <StatusBadge
              kind="form"
              variant={needsRefill ? "warning" : "info"}
              title={item.medicine_form.name}
            />
          ) : (
            <span className="text-slate-400">-</span>
          );

        case "volume":
          return (
            <span
              className={`text-[13px] ${
                needsRefill ? "text-red-700" : "text-slate-600"
              }`}
            >
              {item.volume ?? "-"}
            </span>
          );

        case "quantity":
          return (
            <span
              className={`whitespace-nowrap text-[13px] font-medium ${
                needsRefill ? "text-red-700" : "text-slate-800"
              }`}
            >
              {item.quantity} ({item.unit})
            </span>
          );

        case "nearestExpiry":
          return (
            <span
              className={`whitespace-nowrap text-[13px] ${
                needsRefill ? "text-red-700" : "text-slate-600"
              }`}
            >
              {item.nearestExpiry ?? "-"}
            </span>
          );

        case "status":
          return (
            <StatusBadge
              variant={needsRefill ? "warning" : "success"}
              title={needsRefill ? "Потребує поповнення" : "Достатньо"}
            />
          );

        default:
          return null;
      }
    },
  }));

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
          <InventoryTable
            items={filteredItems}
            columns={medicineTableColumns}
            getRowKey={(item) => item.id}
            getRowClassName={(item) =>
              item.needsRefill
                ? "bg-red-50 hover:bg-red-100/70"
                : "bg-white hover:bg-slate-50"
            }
            onRowClick={handleRowClick}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={(key) => handleSortChange(key as MedicineSortKey)}
            emptyMessage={
              needsRefillOnly
                ? "Препаратів, що потребують поповнення, немає"
                : "Препаратів немає"
            }
          />
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

      {isDeleting && <InfoMessage message="Видалення препарату..." />}
    </div>
  );
};

export default MedsTableClient;
