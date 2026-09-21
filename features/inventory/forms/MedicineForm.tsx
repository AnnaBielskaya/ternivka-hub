"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import type {
  MedicineCreateState,
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import {
  INPUT_CLASS_NAME,
  INVENTORY_UNITS,
  LABEL_CLASS_NAME,
  MEDICINE_UNITS_BY_FORM,
  MONTHS,
  SELECT_CLASS_NAME,
} from "@/features/inventory/constants";

import MedicineNameAutocomplete from "@/features/inventory/components/MedicineNameAutocomplete";
import { createMedicine } from "@/features/inventory/actions/create-medicine";

const initialMedicineCreateState: MedicineCreateState = {
  status: "idle",
  message: "",
};

type MedicineFormProps = {
  medicineForms: MedicineFormRow[];
  medicinePurposes: MedicinePurposeRow[];
  onSaved: () => void;
};

type FormSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const FormSection = ({ title, description, children }: FormSectionProps) => {
  return (
    <section>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>

        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>

      {children}
    </section>
  );
};

type FieldProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
};

const Field = ({ label, htmlFor, required = false, children }: FieldProps) => {
  return (
    <div>
      <label htmlFor={htmlFor} className={LABEL_CLASS_NAME}>
        {label}

        {required && <span className="text-red-500"> *</span>}
      </label>

      {children}
    </div>
  );
};

const MedicineForm = ({
  medicineForms,
  medicinePurposes,
  onSaved,
}: MedicineFormProps) => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [formId, setFormId] = useState("");
  const [unit, setUnit] = useState("");

  const [state, formAction, isPending] = useActionState(
    createMedicine,
    initialMedicineCreateState
  );

  const selectedForm = medicineForms.find((form) => form.id === formId);

  const availableUnitValues = selectedForm
    ? MEDICINE_UNITS_BY_FORM[
        selectedForm.name as keyof typeof MEDICINE_UNITS_BY_FORM
      ] ?? []
    : [];

  const availableUnits = INVENTORY_UNITS.filter((inventoryUnit) =>
    availableUnitValues.includes(inventoryUnit.value as never)
  );

  useEffect(() => {
    if (!selectedForm) {
      setUnit("");
      return;
    }

    const allowedUnits =
      MEDICINE_UNITS_BY_FORM[
        selectedForm.name as keyof typeof MEDICINE_UNITS_BY_FORM
      ] ?? [];

    if (!allowedUnits.includes(unit as never)) {
      setUnit(allowedUnits[0] ?? "");
    }
  }, [selectedForm, unit]);

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
        <FormSection
          title="Основна інформація"
          description="Основні характеристики препарату"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <Field label="Назва" htmlFor="name" required>
                <MedicineNameAutocomplete
                  value={name}
                  onChange={setName}
                  disabled={isPending}
                />
              </Field>
            </div>

            <Field label="Діюча речовина">
              <input
                id="active_ingredient"
                name="active_ingredient"
                type="text"
                disabled={isPending}
                placeholder="Наприклад, парацетамол"
                className={INPUT_CLASS_NAME}
              />
            </Field>

            <Field label="Форма випуску" htmlFor="form_id" required>
              <select
                id="form_id"
                name="form_id"
                required
                value={formId}
                disabled={isPending}
                className={SELECT_CLASS_NAME}
                onChange={(event) => setFormId(event.target.value)}
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
            </Field>

            <Field label="Призначення" htmlFor="purpose_id">
              <select
                id="purpose_id"
                name="purpose_id"
                defaultValue=""
                disabled={isPending}
                className={SELECT_CLASS_NAME}
              >
                <option value="">Не обрано</option>

                {medicinePurposes.map((purpose) => (
                  <option key={purpose.id} value={purpose.id}>
                    {purpose.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </FormSection>

        <div className="border-t border-gray-100" />

        <FormSection
          title="Характеристики"
          description="Дозування та фізичні характеристики"
        >
          <div className="grid grid-cols-3 gap-4">
            <Field label="Дозування" htmlFor="dosage">
              <input
                id="dosage"
                name="dosage"
                type="text"
                disabled={isPending}
                placeholder="Наприклад, 500 мг"
                className={INPUT_CLASS_NAME}
              />
            </Field>

            <Field label="Обʼєм" htmlFor="volume">
              <input
                id="volume"
                name="volume"
                type="text"
                disabled={isPending}
                placeholder="Наприклад, 100 мл"
                className={INPUT_CLASS_NAME}
              />
            </Field>
          </div>
        </FormSection>

        <div className="border-t border-gray-100" />

        <FormSection
          title="Залишок"
          description="Фактична кількість, мінімальний залишок та термін придатності"
        >
          <div className="grid grid-cols-3 gap-4">
            <Field label="Кількість" htmlFor="quantity">
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                disabled={isPending}
                className={INPUT_CLASS_NAME}
              />
            </Field>

            <Field label="Одиниця обліку" htmlFor="unit" required>
              <select
                id="unit"
                name="unit"
                required
                value={unit}
                disabled={isPending || !selectedForm}
                className={SELECT_CLASS_NAME}
                onChange={(event) => setUnit(event.target.value)}
              >
                <option value="" disabled>
                  {!selectedForm ? "Спочатку оберіть форму" : "Оберіть одиницю"}
                </option>

                {availableUnits.map((inventoryUnit) => (
                  <option key={inventoryUnit.value} value={inventoryUnit.value}>
                    {inventoryUnit.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Мінімальний залишок" htmlFor="minimum_quantity">
              <input
                id="minimum_quantity"
                name="minimum_quantity"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                disabled={isPending}
                className={INPUT_CLASS_NAME}
              />
            </Field>

            <div className="col-span-3">
              <Field label="Термін придатності">
                <div className="grid grid-cols-2 gap-4">
                  <select
                    id="expiry_month"
                    name="expiry_month"
                    defaultValue=""
                    disabled={isPending}
                    className={SELECT_CLASS_NAME}
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
                    className={INPUT_CLASS_NAME}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Статус визначається автоматично за фактичною та мінімальною
                  кількістю.
                </p>
              </Field>
            </div>
          </div>
        </FormSection>

        <div className="border-t border-gray-100" />

        <FormSection
          title="Опис"
          description="Додаткова інформація про препарат"
        >
          <textarea
            id="description"
            name="description"
            rows={3}
            disabled={isPending}
            placeholder="Особливості зберігання, примітки або інша важлива інформація..."
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
          />
        </FormSection>

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
