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
      <div className="flex min-w-0 items-center gap-1.5">
        {SORT_OPTIONS.map((option) => {
          const isActive = sortKey === option.key;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onSortChange(option.key)}
              className={`inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{option.label}</span>

              {isActive && (
                <span className="text-[13px] leading-none text-white">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={() => onRefillChange(!refillOnly)}
          className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition ${
            refillOnly
              ? "bg-gray-800 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <span>⚠</span>
          <span>Потребує поповнення</span>
        </button>

        <select
          defaultValue=""
          className="h-9 cursor-pointer rounded-lg bg-slate-100 px-3 text-[13px] font-medium text-slate-600 outline-none transition hover:bg-slate-200 focus:bg-slate-200"
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