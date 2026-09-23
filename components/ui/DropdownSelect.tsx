"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type DropdownSelectOption = {
  value: string;
  label: string;
};

type DropdownSelectProps = {
  value: string | null;
  options: DropdownSelectOption[];
  placeholder?: string;
  variant?: "filled" | "outline";
  onChange: (value: string | null) => void;
  className?: string;
  disabled?: boolean;
};

const DropdownSelect = ({
  value,
  options,
  placeholder = "Оберіть",
  variant = "filled",
  onChange,
  className = "",
  disabled = false,
}: DropdownSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (nextValue: string | null) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  const buttonClassName =
    variant === "filled"
      ? `bg-slate-100 text-slate-600 ${
          isOpen ? "text-slate-900 shadow-sm" : "hover:bg-slate-200"
        }`
      : `border border-slate-200 bg-white text-slate-600 ${
          isOpen
            ? "border-slate-300 text-slate-900 shadow-sm"
            : "hover:border-slate-300"
        }`;

  return (
    <div ref={selectRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((current) => !current);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`inline-flex h-9 w-full min-w-0 items-center justify-between gap-3 rounded-lg px-3 text-[13px] font-medium transition ${
          disabled
            ? "cursor-not-allowed bg-slate-50 text-slate-400"
            : `cursor-pointer ${buttonClassName}`
        }`}
      >
        <span className="min-w-0 truncate">
          {selectedOption?.label ?? placeholder}
        </span>

        <ChevronDown
          size={15}
          strokeWidth={1.8}
          className={`shrink-0 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 top-full z-50 mt-1.5 min-w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-200/40">
          {options.map((option) => {
            const isActive = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => handleChange(option.value)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] transition ${
                  isActive
                    ? "bg-slate-100 font-semibold text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="min-w-0 truncate">{option.label}</span>

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
  );
};

export default DropdownSelect;
