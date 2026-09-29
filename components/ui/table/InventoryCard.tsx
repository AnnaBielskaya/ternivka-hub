"use client";

import type { ReactNode } from "react";

import StatusBadge from "@/components/ui/StatusBadge";

type InventoryCardField = {
  label: string;
  value: ReactNode;
};

type InventoryCardProps = {
  title: string;
  description?: string | null;
  badge?: ReactNode;
  fields: InventoryCardField[];
  quantity: ReactNode;
  quantityUnit?: ReactNode;
  status: {
    title: string;
    variant: "warning" | "success" | "info";
  };
  highlighted?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

const InventoryCard = ({
  title,
  description,
  badge,
  fields,
  quantity,
  quantityUnit,
  status,
  highlighted = false,
  disabled = false,
  onClick,
}: InventoryCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group w-full rounded-xl border p-4 text-left transition active:scale-[0.99] ${
        highlighted
          ? "border-red-100 bg-red-50/40 hover:bg-red-50/70"
          : "border-indigo-100/50 bg-indigo-50/30 hover:border-indigo-200 hover:bg-indigo-50/60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`min-w-0 truncate text-[15px] font-semibold leading-5 ${
                highlighted ? "text-red-700" : "text-slate-900"
              }`}
            >
              {title}
            </h3>

            <span
              className={`shrink-0 text-base text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400 ${
                highlighted ? "text-red-200" : ""
              }`}
              aria-hidden="true"
            >
              →
            </span>
          </div>

          {description ? (
            <p
              className={`mt-1 text-[12px] leading-[17px] ${
                highlighted ? "text-red-400" : "text-slate-400"
              } line-clamp-2`}
            >
              {description}
            </p>
          ) : null}
        </div>

        {badge ? <div className="shrink-0">{badge}</div> : null}
      </div>

      {fields.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3.5">
          {fields.map((field) => (
            <div key={field.label} className="min-w-0">
              <span className="block text-[11px] font-medium text-slate-400">
                {field.label}
              </span>

              <span
                className={`mt-1 block truncate text-[13px] font-semibold leading-5 ${
                  highlighted ? "text-red-700" : "text-slate-800"
                }`}
              >
                {field.value ?? "—"}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div
        className={`mt-4 flex items-end justify-between gap-3 border-t pt-3.5 ${
          highlighted ? "border-red-100" : "border-slate-100"
        }`}
      >
        <div className="min-w-0">
          <span className="block text-[11px] font-medium text-slate-400">
            Кількість
          </span>

          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`text-[20px] font-bold leading-none ${
                highlighted ? "text-red-700" : "text-slate-900"
              }`}
            >
              {quantity}
            </span>

            {quantityUnit ? (
              <span
                className={`text-[13px] font-semibold ${
                  highlighted ? "text-red-500" : "text-slate-500"
                }`}
              >
                {quantityUnit}
              </span>
            ) : null}
          </div>
        </div>

        <StatusBadge title={status.title} variant={status.variant} />
      </div>
    </button>
  );
};

export default InventoryCard;
