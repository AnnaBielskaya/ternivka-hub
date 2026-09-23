"use client";

import { MEDICINE_UNITS_BY_FORM } from "../constants";

type MedsToolbarProps = {
  selectedForm: string | null;
  onFormChange: (form: string | null) => void;
  refillOnly: boolean;
  onRefillChange: (value: boolean) => void;
};

const FORM_FILTERS = ["Усі форми", ...Object.keys(MEDICINE_UNITS_BY_FORM)];

const MedsToolbar = ({
  selectedForm,
  onFormChange,
  refillOnly,
  onRefillChange,
}: MedsToolbarProps) => {
  return (
    <div className="mb-3 flex items-center justify-between gap-6 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FORM_FILTERS.map((filter) => {
          const isActive =
            filter === "Усі форми"
              ? selectedForm === null
              : selectedForm === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() =>
                onFormChange(filter === "Усі форми" ? null : filter)
              }
              className={`inline-flex h-9 shrink-0 cursor-pointer items-center rounded-lg px-3 text-[13px] font-medium transition ${
                isActive
                  ? "bg-gray-800 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="shrink-0 border-l border-slate-200 pl-3">
        <button
          type="button"
          onClick={() => onRefillChange(!refillOnly)}
          className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition ${
            refillOnly
              ? "bg-red-100 text-red-700 shadow-sm"
              : "bg-red-50/70 text-red-600 hover:bg-red-100 hover:text-red-700"
          }`}
        >
          <span className="text-[12px]">⚠</span>
          <span>Потребує поповнення</span>
        </button>
      </div>
    </div>
  );
};

export default MedsToolbar;
