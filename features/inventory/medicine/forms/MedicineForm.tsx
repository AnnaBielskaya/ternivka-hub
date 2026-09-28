"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { INPUT_CLASS_NAME } from "@/features/inventory/constants";

import DropdownSelect from "@/components/ui/DropdownSelect";
import FormField from "@/components/ui/FormField";
import FormSection from "@/components/ui/FormSection";

import MedicineNameAutocomplete from "@/features/inventory/medicine/components/MedicineNameAutocomplete";

import type {
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import { useMedicineForm } from "@/features/inventory/medicine/hooks/useMedicineForm";

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

  const {
    form,
    state,
    formAction,
    isPending,
    selectedForm,
    formOptions,
    purposeOptions,
    unitOptions,
    monthOptions,
    yearOptions,
    updateField,
    handleSelectMedicine,
  } = useMedicineForm({
    medicineForms,
    medicinePurposes,
  });

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    router.refresh();
    onSaved();
  }, [state.status, router, onSaved]);
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

            <FormField label="Форма випуску" required>
              <DropdownSelect
                value={form.form_id || null}
                options={formOptions}
                placeholder="Оберіть форму"
                variant="outline"
                disabled={isPending}
                onChange={(value) => updateField("form_id", value ?? "")}
              />

              <input type="hidden" name="form_id" value={form.form_id} />
            </FormField>

            <FormField label="Призначення">
              <DropdownSelect
                value={form.purpose_id || null}
                options={purposeOptions}
                placeholder="Не обрано"
                variant="outline"
                disabled={isPending}
                onChange={(value) => updateField("purpose_id", value ?? "")}
              />

              <input type="hidden" name="purpose_id" value={form.purpose_id} />
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

            <FormField label="Одиниця обліку" required>
              <DropdownSelect
                value={form.unit || null}
                options={unitOptions}
                placeholder={
                  !selectedForm ? "Спочатку оберіть форму" : "Оберіть одиницю"
                }
                variant="outline"
                disabled={isPending || !selectedForm}
                onChange={(value) => updateField("unit", value ?? "")}
              />

              <input type="hidden" name="unit" value={form.unit} />
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div>
                    <DropdownSelect
                      value={form.expiry_month || null}
                      options={monthOptions}
                      placeholder="Місяць"
                      variant="outline"
                      disabled={isPending}
                      onChange={(value) =>
                        updateField("expiry_month", value ?? "")
                      }
                    />

                    <input
                      type="hidden"
                      name="expiry_month"
                      value={form.expiry_month}
                    />
                  </div>

                  <div>
                    <DropdownSelect
                      value={form.expiry_year || null}
                      options={yearOptions}
                      placeholder="Рік"
                      variant="outline"
                      disabled={isPending}
                      onChange={(value) =>
                        updateField("expiry_year", value ?? "")
                      }
                    />

                    <input
                      type="hidden"
                      name="expiry_month"
                      value={form.expiry_month}
                    />
                  </div>
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
