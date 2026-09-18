"use client";

import type {
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

const INVENTORY_UNITS = [
  { value: "блістер", label: "Блістер" },
  { value: "упаковка", label: "Упаковка" },
  { value: "ампули", label: "Ампули" },
  { value: "грам", label: "Грам" },
  { value: "штука", label: "Штука" },
] as const;

const MONTHS = Array.from(
  { length: 12 },
  (_, index) => index + 1,
);

const inputClassName =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100";

const selectClassName =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100";

const labelClassName =
  "mb-1.5 block text-sm font-medium text-gray-700";

type MedicineFormProps = {
  medicineForms: MedicineFormRow[];
  medicinePurposes: MedicinePurposeRow[];
};

const MedicineForm = ({
  medicineForms,
  medicinePurposes,
}: MedicineFormProps) => {
  return (
    <form id="medicine-form">
      <div className="space-y-7 p-6">
        {/* Основна інформація */}
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
            {/* Назва */}
            <div className="col-span-3">
              <label
                htmlFor="name"
                className={labelClassName}
              >
                Назва <span className="text-red-500">*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Наприклад, Парацетамол"
                className={inputClassName}
              />
            </div>

            {/* Діюча речовина */}
            <div>
              <label
                htmlFor="active_ingredient"
                className={labelClassName}
              >
                Діюча речовина
              </label>

              <input
                id="active_ingredient"
                name="active_ingredient"
                type="text"
                placeholder="Наприклад, парацетамол"
                className={inputClassName}
              />
            </div>

            {/* Форма */}
            <div>
              <label
                htmlFor="form_id"
                className={labelClassName}
              >
                Форма випуску{" "}
                <span className="text-red-500">*</span>
              </label>

              <select
                id="form_id"
                name="form_id"
                required
                defaultValue=""
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

            {/* Призначення */}
            <div>
              <label
                htmlFor="purpose_id"
                className={labelClassName}
              >
                Призначення
              </label>

              <select
                id="purpose_id"
                name="purpose_id"
                defaultValue=""
                className={selectClassName}
              >
                <option value="">Не обрано</option>

                {medicinePurposes.map((purpose) => (
                  <option
                    key={purpose.id}
                    value={purpose.id}
                  >
                    {purpose.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className="border-t border-gray-100" />

        {/* Характеристики */}
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
            {/* Дозування */}
            <div>
              <label
                htmlFor="dosage"
                className={labelClassName}
              >
                Дозування
              </label>

              <input
                id="dosage"
                name="dosage"
                type="text"
                placeholder="Наприклад, 500 мг"
                className={inputClassName}
              />
            </div>

            {/* Обʼєм */}
            <div>
              <label
                htmlFor="volume"
                className={labelClassName}
              >
                Обʼєм
              </label>

              <input
                id="volume"
                name="volume"
                type="text"
                placeholder="Наприклад, 100 мл"
                className={inputClassName}
              />
            </div>
          </div>
        </section>

        <div className="border-t border-gray-100" />

        {/* Залишок */}
        <section>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Залишок
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Кількість, одиниця обліку, строк придатності та поповнення
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Кількість */}
            <div>
              <label
                htmlFor="quantity"
                className={labelClassName}
              >
                Кількість
              </label>

              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                className={inputClassName}
              />
            </div>

            {/* Одиниця */}
            <div>
              <label
                htmlFor="unit"
                className={labelClassName}
              >
                Одиниця обліку{" "}
                <span className="text-red-500">*</span>
              </label>

              <select
                id="unit"
                name="unit"
                required
                defaultValue=""
                className={selectClassName}
              >
                <option value="" disabled>
                  Оберіть одиницю
                </option>

                {INVENTORY_UNITS.map((unit) => (
                  <option
                    key={unit.value}
                    value={unit.value}
                  >
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Мінімальний залишок */}
            <div>
              <label
                htmlFor="minimum_quantity"
                className={labelClassName}
              >
                Мінімальний залишок
              </label>

              <input
                id="minimum_quantity"
                name="minimum_quantity"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                className={inputClassName}
              />
            </div>

            {/* Місяць */}
            <div>
              <label
                htmlFor="expiry_month"
                className={labelClassName}
              >
                Місяць закінчення
              </label>

              <select
                id="expiry_month"
                name="expiry_month"
                defaultValue=""
                className={selectClassName}
              >
                <option value="">Не вказано</option>

                {MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {String(month).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>

            {/* Рік */}
            <div>
              <label
                htmlFor="expiry_year"
                className={labelClassName}
              >
                Рік закінчення
              </label>

              <input
                id="expiry_year"
                name="expiry_year"
                type="number"
                min="2020"
                step="1"
                placeholder="2027"
                className={inputClassName}
              />
            </div>

            {/* Потребує поповнення */}
            <div className="flex items-end">
              <label className="flex h-10 cursor-pointer items-center gap-2">
                <input
                  id="refill_required"
                  name="refill_required"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                />

                <span className="text-sm font-medium text-gray-700">
                  Потребує поповнення
                </span>
              </label>
            </div>
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Статус «Мало» визначається автоматично, коли
            кількість менша за мінімальний залишок.
          </p>
        </section>

        <div className="border-t border-gray-100" />

        {/* Опис */}
        <section>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Опис
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Додаткова інформація про препарат
            </p>
          </div>

          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Особливості зберігання, примітки або інша важлива інформація..."
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </section>
      </div>
    </form>
  );
};

export default MedicineForm;
