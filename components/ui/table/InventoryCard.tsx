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
      className={`w-full cursor-pointer rounded-xl p-4 text-left transition ${
        highlighted
          ? "bg-red-50/60 hover:bg-red-50/80"
          : "bg-slate-50/80 hover:bg-slate-100/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={`text-sm font-semibold leading-5 ${
              highlighted ? "text-red-700" : "text-slate-900"
            }`}
          >
            {title}
          </h3>

          {description && (
            <p
              className={`mt-1 line-clamp-2 text-xs leading-4 ${
                highlighted ? "text-red-400" : "text-slate-400"
              }`}
            >
              {description}
            </p>
          )}
        </div>

        {badge}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        {fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <span className="block text-[11px] text-slate-400">
              {field.label}
            </span>

            <span
              className={`mt-0.5 block truncate text-xs font-medium ${
                highlighted ? "text-red-700" : "text-slate-800"
              }`}
            >
              {field.value ?? "—"}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-200/60 pt-3">
        <div>
          <span className="block text-[11px] text-slate-400">Кількість</span>

          <span
            className={`mt-0.5 block text-sm font-semibold ${
              highlighted ? "text-red-700" : "text-slate-900"
            }`}
          >
            {quantity}{" "}
            {quantityUnit && (
              <span className="text-xs font-medium">{quantityUnit}</span>
            )}
          </span>
        </div>

        <StatusBadge title={status.title} variant={status.variant} />
      </div>
    </button>
  );
};

export default InventoryCard;
