"use client";

import type {
  MedicineSortKey,
  SortDirection,
} from "@/features/inventory/types";

type MedsToolbarProps = {
  sortKey: MedicineSortKey;
  sortDirection: SortDirection;
  onSortChange: (key: MedicineSortKey, direction: SortDirection) => void;
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
}: MedsToolbarProps) => {
  const handleSortClick = (key: MedicineSortKey) => {
    if (sortKey === key) {
      onSortChange(key, sortDirection === "asc" ? "desc" : "asc");

      return;
    }

    onSortChange(key, "asc");
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500">Сортувати:</span>

        {SORT_OPTIONS.map((option) => {
          const isActive = sortKey === option.key;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => handleSortClick(option.key)}
              className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition ${
                isActive
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option.label}

              {isActive && (
                <span className="text-xs">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
          <span>Потребує поповнення</span>
        </label>

        <select
          defaultValue=""
          className="h-9 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition hover:bg-gray-50 focus:border-gray-400"
        >
          <option value="">Усі категорії</option>
          <option value="painkillers">Знеболювальні</option>
          <option value="antibiotics">Антибіотики</option>
          <option value="infusions">Інфузійні розчини</option>
          <option value="other">Інше</option>
        </select>
      </div>
    </div>
  );
};

export default MedsToolbar;
