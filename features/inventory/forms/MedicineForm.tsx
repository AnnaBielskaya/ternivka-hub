"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  MedicalItemRow,
  MedicineCreateState,
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import {
  INPUT_CLASS_NAME,
  INVENTORY_UNITS,
  MEDICINE_UNITS_BY_FORM,
  MONTHS,
  SELECT_CLASS_NAME,
} from "@/features/inventory/constants";

import FormField from "@/components/ui/FormField";
import FormSection from "@/components/ui/FormSection";

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

type MedicineFormValues = {
  name: string;
  active_ingredient: string;
  form_id: string;
  purpose_id: string;
  dosage: string;
  volume: string;
  quantity: string;
  unit: string;
  minimum_quantity: string;
  expiry_month: string;
  expiry_year: string;
  description: string;
};

const EMPTY_FORM: MedicineFormValues = {
  name: "",
  active_ingredient: "",
  form_id: "",
  purpose_id: "",
  dosage: "",
  volume: "",
  quantity: "0",
  unit: "",
  minimum_quantity: "0",
  expiry_month: "",
  expiry_year: "",
  description: "",
};

const getMedicineQuantity = (stock: MedicalItemRow["stock"]) => {
  return stock.reduce((total, item) => total + Number(item.quantity), 0);
};

const getNearestStock = (stock: MedicalItemRow["stock"]) => {
  return (
    [...stock]
      .filter((item) => Number(item.quantity) > 0)
      .sort((a, b) => {
        const dateA = a.expiry_year * 100 + a.expiry_month;

        const dateB = b.expiry_year * 100 + b.expiry_month;

        return dateA - dateB;
      })[0] ?? null
  );
};

const MedicineForm = ({
  medicineForms,
  medicinePurposes,
  onSaved,
}: MedicineFormProps) => {
  const router = useRouter();

  const [form, setForm] = useState<MedicineFormValues>(EMPTY_FORM);

  const [state, formAction, isPending] = useActionState(
    createMedicine,
    initialMedicineCreateState
  );

  const selectedForm = medicineForms.find(
    (medicineForm) => medicineForm.id === form.form_id
  );

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
      setForm((current) => ({
        ...current,
        unit: "",
      }));

      return;
    }

    const allowedUnits =
      MEDICINE_UNITS_BY_FORM[
        selectedForm.name as keyof typeof MEDICINE_UNITS_BY_FORM
      ] ?? [];

    if (!allowedUnits.includes(form.unit as never)) {
      setForm((current) => ({
        ...current,
        unit: allowedUnits[0] ?? "",
      }));
    }
  }, [selectedForm, form.unit]);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    router.refresh();
    onSaved();
  }, [state.status, router, onSaved]);

  const updateField = <K extends keyof MedicineFormValues>(
    field: K,
    value: MedicineFormValues[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSelectMedicine = (medicine: MedicalItemRow) => {
    const quantity = getMedicineQuantity(medicine.stock);

    const nearestStock = getNearestStock(medicine.stock);

    setForm({
      name: medicine.name,
      active_ingredient: medicine.active_ingredient ?? "",
      form_id: medicine.medicine_form?.id ?? "",
      purpose_id: medicine.medicine_purpose?.id ?? "",
      dosage: medicine.dosage ?? "",
      volume: medicine.volume ?? "",
      quantity: String(quantity),
      unit: medicine.unit,
      minimum_quantity: String(medicine.minimum_quantity),
      expiry_month: nearestStock ? String(nearestStock.expiry_month) : "",
      expiry_year: nearestStock ? String(nearestStock.expiry_year) : "",
      description: medicine.description ?? "",
    });
  };

  return (
    <form id="medicine-form" action={formAction}>
      <div className="space-y-7 p-4 sm:p-6">
        <FormSection
          title="Основна інформація"
          description="Основні характеристики препарату"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2 lg:col-span-3">
              <FormField label="Назва" htmlFor="name" required>
                <MedicineNameAutocomplete
                  value={form.name}
                  onChange={(value) => updateField("name", value)}
                  onSelect={handleSelectMedicine}
                  disabled={isPending}
                />
              </FormField>
            </div>

            <FormField label="Діюча речовина">
              <input
                id="active_ingredient"
                name="active_ingredient"
                type="text"
                value={form.active_ingredient}
                disabled={isPending}
                placeholder="Наприклад, парацетамол"
                className={INPUT_CLASS_NAME}
                onChange={(event) =>
                  updateField("active_ingredient", event.target.value)
                }
              />
            </FormField>

            <FormField label="Форма випуску" htmlFor="form_id" required>
              <select
                id="form_id"
                name="form_id"
                required
                value={form.form_id}
                disabled={isPending}
                className={SELECT_CLASS_NAME}
                onChange={(event) => updateField("form_id", event.target.value)}
              >
                <option value="" disabled>
                  Оберіть форму
                </option>

                {medicineForms.map((medicineForm) => (
                  <option key={medicineForm.id} value={medicineForm.id}>
                    {medicineForm.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Призначення" htmlFor="purpose_id">
              <select
                id="purpose_id"
                name="purpose_id"
                value={form.purpose_id}
                disabled={isPending}
                className={SELECT_CLASS_NAME}
                onChange={(event) =>
                  updateField("purpose_id", event.target.value)
                }
              >
                <option value="">Не обрано</option>

                {medicinePurposes.map((purpose) => (
                  <option key={purpose.id} value={purpose.id}>
                    {purpose.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </FormSection>

        <div className="border-t border-gray-100" />

        <FormSection
          title="Характеристики"
          description="Дозування та фізичні характеристики"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormField label="Дозування" htmlFor="dosage">
              <input
                id="dosage"
                name="dosage"
                type="text"
                value={form.dosage}
                disabled={isPending}
                placeholder="Наприклад, 500 мг"
                className={INPUT_CLASS_NAME}
                onChange={(event) => updateField("dosage", event.target.value)}
              />
            </FormField>

            <FormField label="Обʼєм" htmlFor="volume">
              <input
                id="volume"
                name="volume"
                type="text"
                value={form.volume}
                disabled={isPending}
                placeholder="Наприклад, 100 мл"
                className={INPUT_CLASS_NAME}
                onChange={(event) => updateField("volume", event.target.value)}
              />
            </FormField>
          </div>
        </FormSection>

        <div className="border-t border-gray-100" />

        <FormSection
          title="Залишок"
          description="Фактична кількість, мінімальний залишок та термін придатності"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormField label="Кількість" htmlFor="quantity">
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="1"
                value={form.quantity}
                disabled={isPending}
                className={INPUT_CLASS_NAME}
                onChange={(event) =>
                  updateField("quantity", event.target.value)
                }
              />
            </FormField>

            <FormField label="Одиниця обліку" htmlFor="unit" required>
              <select
                id="unit"
                name="unit"
                required
                value={form.unit}
                disabled={isPending || !selectedForm}
                className={SELECT_CLASS_NAME}
                onChange={(event) => updateField("unit", event.target.value)}
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
            </FormField>

            <FormField label="Мінімальний залишок" htmlFor="minimum_quantity">
              <input
                id="minimum_quantity"
                name="minimum_quantity"
                type="number"
                min="0"
                step="1"
                value={form.minimum_quantity}
                disabled={isPending}
                className={INPUT_CLASS_NAME}
                onChange={(event) =>
                  updateField("minimum_quantity", event.target.value)
                }
              />
            </FormField>

            <div className="md:col-span-2 lg:col-span-3">
              <FormField label="Термін придатності">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <select
                    id="expiry_month"
                    name="expiry_month"
                    value={form.expiry_month}
                    disabled={isPending}
                    className={SELECT_CLASS_NAME}
                    onChange={(event) =>
                      updateField("expiry_month", event.target.value)
                    }
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
                    value={form.expiry_year}
                    disabled={isPending}
                    className={INPUT_CLASS_NAME}
                    onChange={(event) =>
                      updateField("expiry_year", event.target.value)
                    }
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Статус визначається автоматично за фактичною та мінімальною
                  кількістю.
                </p>
              </FormField>
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
            value={form.description}
            disabled={isPending}
            placeholder="Особливості зберігання, примітки або інша важлива інформація..."
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
            onChange={(event) => updateField("description", event.target.value)}
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
