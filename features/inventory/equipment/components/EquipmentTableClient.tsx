"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type {
  EquipmentItem,
  EquipmentPowerSource,
  EquipmentStatus,
} from "../types";

import {
  EQUIPMENT_POWER_LABELS,
  EQUIPMENT_STATUS_LABELS,
  EQUIPMENT_TABLE_COLUMNS,
} from "../constants";

import InventoryCard from "@/components/ui/table/InventoryCard";
import InventoryTable from "@/components/ui/table/InventoryTable";
import StatusBadge from "@/components/ui/StatusBadge";
import type { InventoryTableColumn } from "@/components/ui/table/InventoryTable";
import type { UserRole } from "@/features/users/types";

import EquipmentDetailsModal from "./EquipmentDetailsModal";
import EditEquipmentModal from "./EditEquipmentModal";

import { SortDirection } from "../../types";

import { deleteEquipment } from "../actions/delete-equipment";

type EquipmentSortKey =
  | "name"
  | "status"
  | "power_source"
  | "quantity"
  | "created_by";

type EquipmentTableClientProps = {
  items: EquipmentItem[];
  role: UserRole;
};

const collator = new Intl.Collator("uk-UA", {
  sensitivity: "base",
});

const getStatusVariant = (
  status: EquipmentStatus
): "warning" | "success" | "info" => {
  switch (status) {
    case "working":
      return "success";

    case "not_working":
      return "warning";

    case "incomplete":
      return "warning";
  }
};

const getPowerVariant = (
  powerSource: EquipmentPowerSource
): "warning" | "success" | "info" => {
  switch (powerSource) {
    case "both":
      return "success";

    case "mains":
    case "autonomous":
      return "info";
  }
};

const EquipmentTableClient = ({ items, role }: EquipmentTableClientProps) => {
  const router = useRouter();

  const [sortKey, setSortKey] = useState<EquipmentSortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);

  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);

  const [isDeleting, startDeleting] = useTransition();

  const equipmentTableColumns: InventoryTableColumn<EquipmentItem>[] =
    EQUIPMENT_TABLE_COLUMNS.map((column) => ({
      key: column.key,
      label: column.label,
      sortable: column.sortable,
      render: (item) => {
        switch (column.key) {
          case "name":
            return (
              <div className="max-w-[240px] min-w-0">
                <p className="font-medium leading-5 text-slate-900">
                  {item.name}
                </p>
              </div>
            );

          case "status":
            return (
              <StatusBadge
                variant={getStatusVariant(item.status)}
                title={EQUIPMENT_STATUS_LABELS[item.status]}
              />
            );

          case "power_source":
            return (
              <StatusBadge
                variant={getPowerVariant(item.power_source)}
                title={EQUIPMENT_POWER_LABELS[item.power_source]}
              />
            );

          case "quantity":
            return (
              <span className="whitespace-nowrap text-[13px] font-medium text-slate-800">
                {item.quantity} шт.
              </span>
            );

          case "comment":
            return (
              <span className="text-[13px] text-slate-600">
                {item.comment ?? "-"}
              </span>
            );

          case "created_by":
            return (
              <span className="text-[13px] text-slate-600">
                {item.creator ?? "-"}
              </span>
            );

          default:
            return null;
        }
      },
    }));

  const handleSortChange = (key: EquipmentSortKey) => {
    if (key === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));

      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case "name":
          comparison = collator.compare(a.name, b.name);
          break;

        case "status":
          comparison = collator.compare(
            EQUIPMENT_STATUS_LABELS[a.status],
            EQUIPMENT_STATUS_LABELS[b.status]
          );
          break;

        case "power_source":
          comparison = collator.compare(
            EQUIPMENT_POWER_LABELS[a.power_source],
            EQUIPMENT_POWER_LABELS[b.power_source]
          );
          break;

        case "quantity":
          comparison = a.quantity - b.quantity;
          break;

        case "created_by":
          comparison = collator.compare(a.creator ?? "", b.creator ?? "");
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [items, sortKey, sortDirection]);

  const handleRowClick = (item: EquipmentItem) => {
    if (isDeleting) {
      return;
    }

    setSelectedItem(item);
  };

  const handleCloseDetails = () => {
    if (isDeleting) {
      return;
    }

    setSelectedItem(null);
  };

  const handleEdit = () => {
    if (!selectedItem || isDeleting) {
      return;
    }

    setEditingItem(selectedItem);
    setSelectedItem(null);
  };

  const handleDelete = () => {
    if (!selectedItem || isDeleting) {
      return;
    }

    const equipmentId = selectedItem.id;

    startDeleting(async () => {
      const result = await deleteEquipment(equipmentId);

      if (result.status === "error") {
        window.alert(result.message);
        return;
      }

      setSelectedItem(null);
      router.refresh();
    });
  };

  const handleCloseEdit = () => {
    if (isDeleting) {
      return;
    }

    setEditingItem(null);
  };

  const handleSaved = () => {
    setEditingItem(null);
    router.refresh();
  };

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:rounded-md lg:border lg:border-slate-200">
        <div className="lg:hidden">
          {sortedItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {sortedItems.map((item) => (
                <InventoryCard
                  key={item.id}
                  title={item.name}
                  description={item.comment}
                  badge={
                    <StatusBadge
                      variant={getPowerVariant(item.power_source)}
                      title={EQUIPMENT_POWER_LABELS[item.power_source]}
                    />
                  }
                  fields={[
                    {
                      label: "Додав",
                      value: item.creator ?? "—",
                    },
                  ]}
                  quantity={item.quantity}
                  quantityUnit="шт."
                  status={{
                    title: EQUIPMENT_STATUS_LABELS[item.status],
                    variant: getStatusVariant(item.status),
                  }}
                  onClick={() => handleRowClick(item)}
                />
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center text-[13px] text-slate-500">
              Обладнання немає
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <InventoryTable
            items={sortedItems}
            columns={equipmentTableColumns}
            getRowKey={(item) => item.id}
            emptyMessage="Обладнання немає"
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={(key) => handleSortChange(key as EquipmentSortKey)}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      {selectedItem && (
        <EquipmentDetailsModal
          item={selectedItem}
          role={role}
          onClose={handleCloseDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {editingItem && (
        <EditEquipmentModal
          item={editingItem}
          onClose={handleCloseEdit}
          onSaved={handleSaved}
        />
      )}
    </>
  );
};

export default EquipmentTableClient;
