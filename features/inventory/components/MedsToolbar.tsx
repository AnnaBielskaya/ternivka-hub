
"use client";

import type {
  MedicineSortKey,
  SortDirection,
} from "@/features/inventory/types";

type MedsToolbarProps = {
  sortKey: MedicineSortKey;
  sortDirection: SortDirection;
  onSortChange: (key: MedicineSortKey) => void;

  refillOnly: boolean;
  onRefillChange: (value: boolean) => void;
};

const SORT_OPTIONS: {
  key: MedicineSortKey;
  label: string;
}[] = [
  {
    key: "name",
    label: "Назва",
  },
  {
    key: "active_ingredient",
    label: "Діюча речовина",
  },
  {
    key: "nearestExpiry",
    label: "Строк придатності",
  },
  {
    key: "status",
    label: "Статус",
  },
];

const MedsToolbar = ({
  sortKey,
  sortDirection,
  onSortChange,
  refillOnly,
  onRefillChange,
}: MedsToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-6">
      {/* Sorting */}
      <div className="flex min-w-0 items-center gap-2">
        <span className="mr-1 shrink-0 text-xs font-medium text-gray-500">
          Сортування
        </span>

        <div className="flex min-w-0 items-center gap-1.5">
          {SORT_OPTIONS.map((option) => {
            const isActive = sortKey === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onSortChange(option.key)}
                className={`inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition ${
                  isActive
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{option.label}</span>

                {isActive && (
                  <span className="text-xs leading-none">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onRefillChange(!refillOnly)}
          className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition ${
            refillOnly
              ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <span>⚠</span>
          <span>Потребує поповнення</span>
        </button>

        <select
          defaultValue=""
          className="h-9 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 outline-none transition hover:bg-gray-50 focus:border-gray-400"
        >
          <option value="">Усі категорії</option>
          <option value="painkillers">Ця фігня</option>
          <option value="antibiotics">Поки</option>
          <option value="infusions">Не працює</option>
          <option value="other">Треба обговорити</option>
        </select>
      </div>
    </div>
  );
};

export default MedsToolbar;
