"use client";

import { useEffect, useState } from "react";

import CalendarIcon from "@/components/inventory/icons/CalendarIcon";
import type { StockRow } from "@/features/inventory/types";

type StockBatchCardProps = {
  stock: StockRow;
  unit: string;
  isNearest: boolean;
  isUpdating: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (stock: StockRow, quantity: number) => void;
  onCancel: () => void;
};

const formatExpiry = (month: number, year: number) => {
  return `${String(month).padStart(2, "0")}/${year}`;
};

const StockBatchCard = ({
  stock,
  unit,
  isNearest,
  isUpdating,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: StockBatchCardProps) => {
  const [quantity, setQuantity] = useState(String(stock.quantity));

  useEffect(() => {
    setQuantity(String(stock.quantity));
  }, [stock.quantity]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  const handleSave = () => {
    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
      setQuantity(String(stock.quantity));
      return;
    }

    onSave(stock, parsedQuantity);
  };

  const handleQuantityKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSave();
    }

    if (event.key === "Escape") {
      onCancel();
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
            <span className="block text-[11px] font-medium text-slate-400">
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

        <div className="flex shrink-0 items-center">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <div
                className={`flex h-8 items-center rounded-md border bg-white ${
                  isNearest ? "border-blue-200" : "border-slate-200"
                }`}
              >
                <input
                  min="0"
                  type="number"
                  value={quantity}
                  disabled={isUpdating}
                  onChange={handleQuantityChange}
                  onKeyDown={handleQuantityKeyDown}
                  autoFocus
                  className="h-full w-[54px] bg-transparent px-1 text-center text-[13px] font-semibold text-slate-900 outline-none"
                />

                <span className="pr-2 text-[10px] font-medium text-slate-400">
                  {unit}
                </span>
              </div>

              <button
                type="button"
                disabled={isUpdating}
                onClick={handleSave}
                aria-label="Зберегти"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12.5L9.5 17L19 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                disabled={isUpdating}
                onClick={onCancel}
                aria-label="Скасувати"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-semibold leading-none text-slate-900">
                {stock.quantity}
              </span>

              <span className="text-[11px] font-medium text-slate-400">
                ({unit})
              </span>

              <button
                type="button"
                onClick={onEdit}
                aria-label="Редагувати кількість"
                className={`ml-0.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border bg-white transition-colors ${
                  isNearest
                    ? "border-blue-100 text-blue-400 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    : "border-slate-200 text-slate-400 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 20H8L19 9C20.1046 7.89543 20.1046 6.10457 19 5C17.8954 3.89543 15.1046 3.89543 14 5L4 15.9999V20Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.5 6.5L17.5 10.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockBatchCard;
