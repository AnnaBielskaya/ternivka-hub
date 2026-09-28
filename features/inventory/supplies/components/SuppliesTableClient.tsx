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

const collator = new Intl.Collator("uk-UA", {
  sensitivity: "base",
});

const SuppliesTableClient = ({ items }: SuppliesTableClientProps) => {
  const [sortKey, setSortKey] = useState<SupplySortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const getNeedsRefill = (item: SupplyItem) => {
    return item.quantity <= item.minimum_quantity;
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case "name":
          comparison = collator.compare(a.name, b.name);
          break;

        case "category":
          comparison = collator.compare(
            a.category?.name ?? "",
            b.category?.name ?? ""
          );
          break;

        case "quantity":
          comparison = a.quantity - b.quantity;
          break;

        case "minimum_quantity":
          comparison = a.minimum_quantity - b.minimum_quantity;
          break;

        case "status":
          comparison = Number(getNeedsRefill(a)) - Number(getNeedsRefill(b));
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
        const needsRefill = getNeedsRefill(item);

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
              </div>
            );

          case "category":
            return item.category ? (
              <StatusBadge
                kind="category"
                variant="info"
                title={item.category.name}
              />
            ) : (
              <span className="text-slate-400">-</span>
            );

          case "quantity":
            return (
              <span
                className={`whitespace-nowrap text-[13px] font-medium ${
                  needsRefill ? "text-red-700" : "text-slate-800"
                }`}
              >
                {item.quantity} {SUPPLY_UNIT_LABELS[item.unit]}
              </span>
            );

          case "minimum_quantity":
            return (
              <span
                className={`whitespace-nowrap text-[13px] ${
                  needsRefill ? "font-semibold text-red-700" : "text-slate-600"
                }`}
              >
                {item.minimum_quantity} {SUPPLY_UNIT_LABELS[item.unit]}
              </span>
            );

          case "comment":
            return (
              <span
                className={`text-[13px] ${
                  needsRefill ? "text-red-700" : "text-slate-600"
                }`}
              >
                {item.comment ?? "-"}
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
              const needsRefill = getNeedsRefill(item);

              return (
                <InventoryCard
                  key={item.id}
                  title={item.name}
                  description={item.comment}
                  badge={
                    <StatusBadge
                      kind="category"
                      variant="info"
                      title={item.category?.name ?? "—"}
                    />
                  }
                  fields={[
                    {
                      label: "Мінімум",
                      value: `${item.minimum_quantity} ${
                        SUPPLY_UNIT_LABELS[item.unit]
                      }`,
                    },
                  ]}
                  quantity={item.quantity}
                  quantityUnit={SUPPLY_UNIT_LABELS[item.unit]}
                  status={{
                    title: needsRefill ? "Потребує поповнення" : "Достатньо",
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
          getRowClassName={(item) =>
            getNeedsRefill(item)
              ? "bg-red-50 hover:bg-red-100/70"
              : "bg-white hover:bg-slate-50"
          }
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
