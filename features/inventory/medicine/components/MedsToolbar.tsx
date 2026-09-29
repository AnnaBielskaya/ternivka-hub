"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, CircleAlert } from "lucide-react";

import { MEDICINE_UNITS_BY_FORM } from "../../constants";

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
  const [isFormMenuOpen, setIsFormMenuOpen] = useState(false);

  const formMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        formMenuRef.current &&
        !formMenuRef.current.contains(event.target as Node)
      ) {
        setIsFormMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedFormLabel = selectedForm ?? "Усі форми";

  const handleFormChange = (form: string | null) => {
    onFormChange(form);
    setIsFormMenuOpen(false);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="hidden min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex">
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
              className={`inline-flex h-9 shrink-0 cursor-pointer items-center rounded-lg px-3 text-[13px] transition ${
                isActive
                  ? "bg-indigo-50/90 font-semibold text-slate-900"
                  : "font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div ref={formMenuRef} className="relative sm:hidden">
        <button
          type="button"
          onClick={() => setIsFormMenuOpen((current) => !current)}
          aria-haspopup="listbox"
          aria-expanded={isFormMenuOpen}
          className={`inline-flex h-9 min-w-36 cursor-pointer items-center justify-between gap-3 rounded-lg bg-slate-100 px-3 text-[13px] font-medium text-slate-600 transition ${
            isFormMenuOpen ? "text-slate-900 shadow-sm" : "hover:bg-slate-200"
          }`}
        >
          <span className="truncate">{selectedFormLabel}</span>

          <ChevronDown
            size={15}
            strokeWidth={1.8}
            className={`shrink-0 text-slate-400 transition-transform ${
              isFormMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isFormMenuOpen && (
          <div className="absolute left-0 top-full z-50 mt-1.5 min-w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-200/40">
            {FORM_FILTERS.map((filter) => {
              const isActive =
                filter === "Усі форми"
                  ? selectedForm === null
                  : selectedForm === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() =>
                    handleFormChange(filter === "Усі форми" ? null : filter)
                  }
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] transition ${
                    isActive
                      ? "bg-slate-100 font-semibold text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{filter}</span>

                  {isActive && (
                    <Check
                      size={14}
                      strokeWidth={2}
                      className="shrink-0 text-slate-600"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onRefillChange(!refillOnly)}
        className={`inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition ${
          refillOnly
            ? "bg-red-50 text-red-700 hover:bg-red-100"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        <CircleAlert
          size={15}
          strokeWidth={1.8}
          className={refillOnly ? "text-red-600" : "text-slate-400"}
        />

        <span>Потребує поповнення</span>
      </button>
    </div>
  );
};

export default MedsToolbar;
