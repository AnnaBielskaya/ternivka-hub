"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  MedicineCreateState,
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import MedicineNameAutocomplete from "@/features/inventory/components/MedicineNameAutocomplete";
import { createMedicine } from "@/features/inventory/actions/create-medicine";

const INVENTORY_UNITS = [
  {
    value: "блістер",
    label: "Блістер",
  },
  {
    value: "упаковка",
    label: "Упаковка",
  },
  {
    value: "ампули",
    label: "Ампули",
  },
  {
    value: "грам",
    label: "Грам",
  },
  {
    value: "штука",
    label: "Штука",
  },
] as const;

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

const inputClassName =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100";

const selectClassName =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100";

const labelClassName = "mb-1.5 block text-sm font-medium text-gray-700";

const initialMedicineCreateState: MedicineCreateState = {
  status: "idle",
  message: "",
};

type MedicineFormProps = {
  medicineForms: MedicineFormRow[];
  medicinePurposes: MedicinePurposeRow[];
  onSaved: () => void;
};

const MedicineForm = ({
  medicineForms,
  medicinePurposes,
  onSaved,
}: MedicineFormProps) => {
  const router = useRouter();

  const [name, setName] = useState("");

  const [state, formAction, isPending] = useActionState(
    createMedicine,
    initialMedicineCreateState
  );

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    router.refresh();
    onSaved();
  }, [state.status, router, onSaved]);

  return (
    <form id="medicine-form" action={formAction}>
      <div className="space-y-7 p-6">
        <section>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Основна інформація
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Основні характеристики препарату
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <label htmlFor="name" className={labelClassName}>
                Назва <span className="text-red-500">*</span>
              </label>

              <MedicineNameAutocomplete
                value={name}
                onChange={setName}
                disabled={isPending}
              />
            </div>

            <div>
              <label htmlFor="active_ingredient" className={labelClassName}>
                Діюча речовина
              </label>

              <input
                id="active_ingredient"
                name="active_ingredient"
                type="text"
                disabled={isPending}
                placeholder="Наприклад, парацетамол"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="form_id" className={labelClassName}>
                Форма випуску <span className="text-red-500">*</span>
              </label>

              <select
                id="form_id"
                name="form_id"
                required
                defaultValue=""
                disabled={isPending}
                className={selectClassName}
              >
                <option value="" disabled>
                  Оберіть форму
                </option>

                {medicineForms.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="purpose_id" className={labelClassName}>
                Призначення
              </label>

              <select
                id="purpose_id"
                name="purpose_id"
                defaultValue=""
                disabled={isPending}
                className={selectClassName}
              >
                <option value="">Не обрано</option>

                {medicinePurposes.map((purpose) => (
                  <option key={purpose.id} value={purpose.id}>
                    {purpose.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className="border-t border-gray-100" />

        <section>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Характеристики
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Дозування та фізичні характеристики
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="dosage" className={labelClassName}>
                Дозування
              </label>

              <input
                id="dosage"
                name="dosage"
                type="text"
                disabled={isPending}
                placeholder="Наприклад, 500 мг"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="volume" className={labelClassName}>
                Обʼєм
              </label>

              <input
                id="volume"
                name="volume"
                type="text"
                disabled={isPending}
                placeholder="Наприклад, 100 мл"
                className={inputClassName}
              />
            </div>
          </div>
        </section>

        <div className="border-t border-gray-100" />

        <section>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Залишок</h3>

            <p className="mt-1 text-xs text-gray-500">
              Фактична кількість, мінімальний залишок та термін придатності
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="quantity" className={labelClassName}>
                Кількість
              </label>

              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                disabled={isPending}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="unit" className={labelClassName}>
                Одиниця обліку <span className="text-red-500">*</span>
              </label>

              <select
                id="unit"
                name="unit"
                required
                defaultValue=""
                disabled={isPending}
                className={selectClassName}
              >
                <option value="" disabled>
                  Оберіть одиницю
                </option>

                {INVENTORY_UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="minimum_quantity" className={labelClassName}>
                Мінімальний залишок
              </label>

              <input
                id="minimum_quantity"
                name="minimum_quantity"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                disabled={isPending}
                className={inputClassName}
              />
            </div>

            <div className="col-span-3">
              <label className={labelClassName}>Термін придатності</label>

              <div className="grid grid-cols-[1fr_1fr_1fr] gap-4">
                <select
                  id="expiry_month"
                  name="expiry_month"
                  defaultValue=""
                  disabled={isPending}
                  className={selectClassName}
                >
                  <option value="">Місяць</option>

                  {MONTHS.map((month) => (
                    <option key={month} value={month}>
                      {String(month).padStart(2, "0")}
                    </option>
                  ))}
                </select>

                <input
                  id="expiry_year"
                  name="expiry_year"
                  type="number"
                  min="2020"
                  step="1"
                  placeholder="Рік"
                  disabled={isPending}
                  className={inputClassName}
                />
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Статус визначається автоматично за фактичною та мінімальною
                кількістю.
              </p>
            </div>
          </div>
        </section>

        <div className="border-t border-gray-100" />

        <section>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Опис</h3>

            <p className="mt-1 text-xs text-gray-500">
              Додаткова інформація про препарат
            </p>
          </div>

          <textarea
            id="description"
            name="description"
            rows={3}
            disabled={isPending}
            placeholder="Особливості зберігання, примітки або інша важлива інформація..."
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
          />
        </section>

        {state.message && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              state.status === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {state.message}
          </div>
        )}
      </div>
    </form>
  );
};

export default MedicineForm;
