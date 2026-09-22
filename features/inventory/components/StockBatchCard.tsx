"use client";

import CalendarIcon from "@/components/inventory/icons/CalendarIcon";
import BoxesIcon from "@/components/inventory/icons/BoxesIcon";
import type { StockRow } from "@/features/inventory/types";

type StockBatchCardProps = {
  stock: StockRow;
  unit: string;
  isNearest: boolean;
  isUpdating: boolean;
  onChangeQuantity: (stock: StockRow, delta: number) => void;
};

const formatExpiry = (month: number, year: number) => {
  return `${String(month).padStart(2, "0")}/${year}`;
};

const StockBatchCard = ({
  stock,
  unit,
  isNearest,
  isUpdating,
  onChangeQuantity,
}: StockBatchCardProps) => {
  return (
    <div
      className={`rounded-lg px-3.5 py-3 ${
        isNearest ? "bg-blue-50" : "bg-slate-50"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
              isNearest
                ? "bg-blue-100 text-blue-600"
                : "bg-white text-slate-400"
            }`}
          >
            <CalendarIcon />
          </div>

          <div className="min-w-0">
            <span className="block text-[11px] text-slate-400">
              Термін придатності
            </span>

            <span
              className={`mt-0.5 block text-[13px] font-semibold ${
                isNearest ? "text-blue-800" : "text-slate-900"
              }`}
            >
              {formatExpiry(stock.expiry_month, stock.expiry_year)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            disabled={isUpdating || Number(stock.quantity) <= 0}
            onClick={() => onChangeQuantity(stock, -1)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>

          <div className="min-w-[72px] text-center">
            <span className="block text-[13px] font-semibold text-slate-900">
              {stock.quantity}
            </span>

            <span className="block text-[10px] text-slate-400">{unit}</span>
          </div>

          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onChangeQuantity(stock, 1)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockBatchCard;
