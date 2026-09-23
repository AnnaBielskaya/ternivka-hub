"use client";

import { AlertTriangle } from "lucide-react";
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
    <div className="flex items-center justify-between gap-4">
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
              className={`inline-flex h-8 shrink-0 cursor-pointer items-center rounded-lg px-3 text-[13px] transition ${
                isActive
                  ? "bg-slate-100 font-semibold text-slate-900"
                  : "font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onRefillChange(!refillOnly)}
        className={`inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-[13px] transition ${
          refillOnly
            ? "bg-red-50 font-medium text-red-700"
            : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <AlertTriangle
          size={14}
          strokeWidth={1.8}
          className={refillOnly ? "text-red-600" : "text-slate-400"}
        />

        <span>Потребує поповнення</span>
      </button>
    </div>
  );
};

export default MedsToolbar;
