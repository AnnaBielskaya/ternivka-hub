"use client";

import { useMemo, useState } from "react";

import StatusBadge from "@/components/ui/StatusBadge";
import InventoryCard from "@/components/ui/table/InventoryCard";
import InventoryTable from "@/components/ui/table/InventoryTable";
import type { InventoryTableColumn } from "@/components/ui/table/InventoryTable";

import type { SortDirection } from "../../types";

import { SUPPLIES_TABLE_COLUMNS, SUPPLY_UNIT_LABELS } from "../constants";

import type { SupplyItem, SupplySortKey } from "../types";

type SuppliesTableClientProps = {
  items: SupplyItem[];
};

const SuppliesTableClient = ({ items }: SuppliesTableClientProps) => {
  const [sortKey, setSortKey] = useState<SupplySortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case "name":
          comparison = a.name.localeCompare(b.name, "uk");
          break;

        case "category":
          comparison = a.category.name.localeCompare(b.category.name, "uk");
          break;

        case "unit":
          comparison = SUPPLY_UNIT_LABELS[a.unit].localeCompare(
            SUPPLY_UNIT_LABELS[b.unit],
            "uk"
          );
          break;

        case "quantity":
          comparison = a.quantity - b.quantity;
          break;

        case "minimum_quantity":
          comparison = a.minimum_quantity - b.minimum_quantity;
          break;

        case "created_by":
          comparison = (a.creator?.name ?? "").localeCompare(
            b.creator?.name ?? "",
            "uk"
          );
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [items, sortKey, sortDirection]);

  const suppliesTableColumns: InventoryTableColumn<SupplyItem>[] =
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

          case "category":
            return (
              <span className="text-[13px] text-slate-600">
                {item.category.name}
              </span>
            );

          case "quantity":
            return (
              <span className="whitespace-nowrap text-[13px] font-medium text-slate-800">
                {item.quantity} {SUPPLY_UNIT_LABELS[item.unit]}
              </span>
            );

          case "minimum_quantity": {
            const needsRefill = item.quantity <= item.minimum_quantity;

            return needsRefill ? (
              <StatusBadge
                variant="warning"
                title={`${item.minimum_quantity} ${
                  SUPPLY_UNIT_LABELS[item.unit]
                }`}
              />
            ) : (
              <span className="whitespace-nowrap text-[13px] text-slate-600">
                {item.minimum_quantity} {SUPPLY_UNIT_LABELS[item.unit]}
              </span>
            );
          }

          case "comment":
            return (
              <span className="text-[13px] text-slate-600">
                {item.comment ?? "-"}
              </span>
            );

          case "created_by":
            return (
              <span className="text-[13px] text-slate-600">
                {item.creator?.name ?? "-"}
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
    <div className="min-h-0 flex-1 overflow-y-auto bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:rounded-md lg:border lg:border-slate-200">
      <div className="lg:hidden">
        {sortedItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {sortedItems.map((item) => {
              const needsRefill = item.quantity <= item.minimum_quantity;

              return (
                <InventoryCard
                  key={item.id}
                  title={item.name}
                  description={item.comment}
                  fields={[
                    {
                      label: "Категорія",
                      value: item.category.name,
                    },
                    {
                      label: "Форма",
                      value: item.unit === "piece" ? "Штука" : "Упаковка",
                    },
                    {
                      label: "Мінімум",
                      value: (
                        <span
                          className={
                            needsRefill
                              ? "font-semibold text-amber-600"
                              : undefined
                          }
                        >
                          {item.minimum_quantity}{" "}
                          {SUPPLY_UNIT_LABELS[item.unit]}
                        </span>
                      ),
                    },
                    {
                      label: "Додав",
                      value: item.creator?.name ?? "—",
                    },
                  ]}
                  quantity={item.quantity}
                  quantityUnit={SUPPLY_UNIT_LABELS[item.unit]}
                  status={{
                    title: needsRefill ? "Потрібне поповнення" : "В наявності",
                    variant: needsRefill ? "warning" : "success",
                  }}
                  onClick={() => {}}
                />
              );
            })}
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
          columns={suppliesTableColumns}
          getRowKey={(item) => item.id}
          emptyMessage="Розхідників немає"
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={(key) => handleSortChange(key as SupplySortKey)}
        />
      </div>
    </div>
  );
};

export default SuppliesTableClient;
