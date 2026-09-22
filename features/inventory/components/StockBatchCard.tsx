"use client";

import { useEffect, useState } from "react";

import CalendarIcon from "@/components/inventory/icons/CalendarIcon";
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
  const [quantity, setQuantity] = useState(String(stock.quantity));

  useEffect(() => {
    setQuantity(String(stock.quantity));
  }, [stock.quantity]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  const handleQuantityBlur = () => {
    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
      setQuantity(String(stock.quantity));
      return;
    }

    const currentQuantity = Number(stock.quantity);

    if (parsedQuantity === currentQuantity) {
      return;
    }

    onChangeQuantity(stock, parsedQuantity - currentQuantity);
  };

  const handleQuantityKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
  };

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

          <div className="min-w-[2px] text-center">
            <input
              min="0"
              value={quantity}
              disabled={isUpdating}
              onChange={handleQuantityChange}
              onBlur={handleQuantityBlur}
              onKeyDown={handleQuantityKeyDown}
              className="h-7 w-[60px] cursor-text rounded-md border border-transparent bg-white text-center text-[13px] font-semibold text-slate-900 outline-none transition hover:border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            />

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
