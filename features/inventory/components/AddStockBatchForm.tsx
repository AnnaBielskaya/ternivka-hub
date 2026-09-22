"use client";

import { useState, useTransition } from "react";

import CustomButton from "@/components/ui/CustomButton";
import { MONTHS } from "@/features/inventory/constants";
import type { StockRow } from "@/features/inventory/types";

import { createStockBatch } from "@/features/inventory/actions/create-stock-batch";

type AddStockBatchFormProps = {
  itemId: string;
  unit: string;
  onCancel: () => void;
  onSaved: (stock: StockRow) => void;
};

const AddStockBatchForm = ({
  itemId,
  unit,
  onCancel,
  onSaved,
}: AddStockBatchFormProps) => {
  const [quantity, setQuantity] = useState("");

  const [expiryMonth, setExpiryMonth] = useState("");

  const [expiryYear, setExpiryYear] = useState("");

  const [error, setError] = useState("");

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await createStockBatch(
        itemId,
        Number(expiryMonth),
        Number(expiryYear),
        Number(quantity)
      );

      if (result.status === "error") {
        setError(result.message);
        return;
      }

      if (result.stock) {
        onSaved(result.stock);
      }

      onCancel();
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2.5 rounded-lg bg-slate-50 p-3.5"
    >
      <div className="grid grid-cols-4 items-end gap-2.5">
        <div>
          <label
            htmlFor="batch_quantity"
            className="mb-1 block text-[11px] font-medium text-slate-600"
          >
            Кількість
          </label>

          <div className="flex items-center gap-1.5">
            <input
              id="batch_quantity"
              type="number"
              min="0.01"
              step="0.01"
              value={quantity}
              disabled={isPending}
              placeholder="0"
              className="h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              onChange={(event) => setQuantity(event.target.value)}
            />

            <span className="text-[10px] text-slate-400">{unit}</span>
          </div>
        </div>

        <div>
          <label
            htmlFor="batch_expiry_month"
            className="mb-1 block text-[11px] font-medium text-slate-600"
          >
            Місяць
          </label>

          <select
            id="batch_expiry_month"
            value={expiryMonth}
            disabled={isPending}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-xs text-slate-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            onChange={(event) => setExpiryMonth(event.target.value)}
          >
            <option value="">Місяць</option>

            {MONTHS.map((month) => (
              <option key={month} value={month}>
                {String(month).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="batch_expiry_year"
            className="mb-1 block text-[11px] font-medium text-slate-600"
          >
            Рік
          </label>

          <input
            id="batch_expiry_year"
            type="number"
            min="2020"
            step="1"
            value={expiryYear}
            disabled={isPending}
            placeholder="2027"
            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            onChange={(event) => setExpiryYear(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <CustomButton
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isPending}
          >
            Скасувати
          </CustomButton>

          <CustomButton type="submit" disabled={isPending}>
            Додати
          </CustomButton>
        </div>
      </div>

      {error && <p className="mt-2.5 text-xs text-red-600">{error}</p>}
    </form>
  );
};

export default AddStockBatchForm;
