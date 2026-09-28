"use client";

import { useMemo, useState } from "react";

import InventoryCard from "@/components/ui/table/InventoryCard";
import StatusBadge from "@/components/ui/StatusBadge";
import type { InventoryTableColumn } from "@/components/ui/table/InventoryTable";
import { SUPPLIES_TABLE_COLUMNS } from "../constants";
import { SupplyItem, SupplySortKey } from "../types";
import InventoryTable from "@/components/ui/table/InventoryTable";
import { SortDirection } from "../../types";

const SuppliesTableClient = () => {
  const [sortKey, setSortKey] = useState<SupplySortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedItem, setSelectedItem] = useState<SupplyItem | null>(null);

  const sortedItems = [];

  const equipmentTableColumns: InventoryTableColumn<SupplyItem>[] =
    SUPPLIES_TABLE_COLUMNS.map((column) => ({
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

          default:
            return null;
        }
      },
    }));

  const handleSortChange = (key: SupplySortKey) => {
    if (key === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));

      return;
    }

    setSortKey(key);
    setSortDirection("asc");
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
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center text-[13px] text-slate-500">
              Розхідників немає
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <InventoryTable
            items={sortedItems}
            columns={equipmentTableColumns}
            getRowKey={(item) => item.id}
            emptyMessage="Розхідників немає"
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={(key) => handleSortChange(key as SupplySortKey)}
            onRowClick={setSelectedItem}
          />
        </div>
      </div>
    </>
  );
};

export default SuppliesTableClient;
