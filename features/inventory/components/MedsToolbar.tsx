"use client";

import { AlertTriangle } from "lucide-react";

import { MEDICINE_UNITS_BY_FORM } from "../constants";

type MedsToolbarProps = {
  selectedForm: string | null;
  onFormChange: (form: string | null) => void;
  refillOnly: boolean;
  onRefillChange: (value: boolean) => void;
};

const FORM_FILTERS = Object.keys(MEDICINE_UNITS_BY_FORM);

const MedsToolbar = ({
  selectedForm,
  onFormChange,
  refillOnly,
  onRefillChange,
}: MedsToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <select
        value={selectedForm ?? ""}
        onChange={(event) => onFormChange(event.target.value || null)}
        className="h-9 min-w-0 max-w-52 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-600 outline-none transition hover:border-slate-300 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
      >
        <option value="">Усі форми</option>

        {FORM_FILTERS.map((filter) => (
          <option key={filter} value={filter}>
            {filter}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => onRefillChange(!refillOnly)}
        className={`inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-[13px] transition ${
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
