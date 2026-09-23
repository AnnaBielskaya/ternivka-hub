"use client";

import { useEffect, useState, useTransition } from "react";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";
import DropdownSelect from "@/components/ui/DropdownSelect";

import type {
  InventoryItem,
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import { updateMedicine } from "@/features/inventory/actions/update-medicine";

import {
  INPUT_CLASS_NAME,
  INVENTORY_UNITS,
  MEDICINE_UNITS_BY_FORM,
} from "@/features/inventory/constants";

type EditMedicineModalProps = {
  item: InventoryItem;
  medicineForms: MedicineFormRow[];
  medicinePurposes: MedicinePurposeRow[];
  onClose: () => void;
  onSaved: () => void;
};

type MedicineFieldProps = {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
};

const MedicineField = ({ label, htmlFor, children }: MedicineFieldProps) => {
  return (
    <div className="min-w-0">
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      {children}
    </div>
  );
};

const EditMedicineModal = ({
  item,
  medicineForms,
  medicinePurposes,
  onClose,
  onSaved,
}: EditMedicineModalProps) => {
  const [name, setName] = useState(item.name);

  const [activeIngredient, setActiveIngredient] = useState(
    item.active_ingredient ?? ""
  );

  const [formId, setFormId] = useState(item.medicine_form?.id ?? "");

  const [purposeId, setPurposeId] = useState(item.medicine_purpose?.id ?? "");

  const [dosage, setDosage] = useState(item.dosage ?? "");

  const [volume, setVolume] = useState(item.volume ?? "");

  const [unit, setUnit] = useState(item.unit);

  const [minimumQuantity, setMinimumQuantity] = useState(
    String(item.minimum_quantity)
  );

  const [description, setDescription] = useState(item.description ?? "");

  const [isPending, startTransition] = useTransition();

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
      return;
    }

    const allowedUnits =
      MEDICINE_UNITS_BY_FORM[
        selectedForm.name as keyof typeof MEDICINE_UNITS_BY_FORM
      ] ?? [];

    if (!allowedUnits.includes(unit as never)) {
      setUnit(allowedUnits[0] ?? "");
    }
  }, [formId, selectedForm, unit]);

  const formOptions = medicineForms.map((form) => ({
    value: form.id,
    label: form.name,
  }));

  const purposeOptions = [
    {
      value: "",
      label: "Не обрано",
    },
    ...medicinePurposes.map((purpose) => ({
      value: purpose.id,
      label: purpose.name,
    })),
  ];

  const unitOptions = availableUnits.map((inventoryUnit) => ({
    value: inventoryUnit.value,
    label: inventoryUnit.label,
  }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    formData.set("name", name);
    formData.set("form_id", formId);
    formData.set("purpose_id", purposeId);
    formData.set("active_ingredient", activeIngredient);
    formData.set("dosage", dosage);
    formData.set("volume", volume);
    formData.set("unit", unit);
    formData.set("minimum_quantity", minimumQuantity);
    formData.set("description", description);

    startTransition(async () => {
      const result = await updateMedicine(item.id, formData);

      if (result.status === "error") {
        window.alert(result.message);
        return;
      }

      onSaved();
    });
  };

  return (
    <Modal
      isOpen={true}
      title="Редагувати препарат"
      onClose={isPending ? () => {} : onClose}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <CustomButton
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Скасувати
          </CustomButton>

          <CustomButton
            type="submit"
            form="edit-medicine-form"
            disabled={isPending}
          >
            {isPending ? "Збереження..." : "Зберегти"}
          </CustomButton>
        </div>
      }
    >
      <form id="edit-medicine-form" onSubmit={handleSubmit}>
        <div className="space-y-7 p-4 sm:p-6">
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Основна інформація
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Основні характеристики препарату
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2 lg:col-span-3">
                <MedicineField label="Назва" htmlFor="edit-name">
                  <input
                    id="edit-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    disabled={isPending}
                    className={INPUT_CLASS_NAME}
                  />
                </MedicineField>
              </div>

              <MedicineField
                label="Діюча речовина"
                htmlFor="edit-active-ingredient"
              >
                <input
                  id="edit-active-ingredient"
                  value={activeIngredient}
                  onChange={(event) => setActiveIngredient(event.target.value)}
                  disabled={isPending}
                  className={INPUT_CLASS_NAME}
                />
              </MedicineField>

              <MedicineField label="Форма випуску">
                <DropdownSelect
                  value={formId || null}
                  options={formOptions}
                  placeholder="Оберіть форму"
                  variant="outline"
                  disabled={isPending}
                  onChange={(value) => setFormId(value ?? "")}
                />
              </MedicineField>

              <MedicineField label="Призначення">
                <DropdownSelect
                  value={purposeId || null}
                  options={purposeOptions}
                  placeholder="Не обрано"
                  variant="outline"
                  disabled={isPending}
                  onChange={(value) => setPurposeId(value ?? "")}
                />
              </MedicineField>
            </div>
          </section>

          <div className="border-t border-gray-100" />

          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Характеристики
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Дозування та фізичні характеристики препарату
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <MedicineField label="Дозування" htmlFor="edit-dosage">
                <input
                  id="edit-dosage"
                  value={dosage}
                  onChange={(event) => setDosage(event.target.value)}
                  disabled={isPending}
                  className={INPUT_CLASS_NAME}
                />
              </MedicineField>

              <MedicineField label="Обʼєм" htmlFor="edit-volume">
                <input
                  id="edit-volume"
                  value={volume}
                  onChange={(event) => setVolume(event.target.value)}
                  disabled={isPending}
                  className={INPUT_CLASS_NAME}
                />
              </MedicineField>

              <MedicineField label="Одиниця обліку">
                <DropdownSelect
                  value={unit || null}
                  options={unitOptions}
                  placeholder={
                    !selectedForm ? "Спочатку оберіть форму" : "Оберіть одиницю"
                  }
                  variant="outline"
                  disabled={isPending || !selectedForm}
                  onChange={(value) => setUnit(value ?? "")}
                />
              </MedicineField>
            </div>
          </section>

          <div className="border-t border-gray-100" />

          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Поповнення запасу
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Контроль мінімального залишку
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <MedicineField
                label="Мінімальний залишок"
                htmlFor="edit-minimum-quantity"
              >
                <input
                  id="edit-minimum-quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={minimumQuantity}
                  onChange={(event) => setMinimumQuantity(event.target.value)}
                  disabled={isPending}
                  className={INPUT_CLASS_NAME}
                />
              </MedicineField>
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
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isPending}
              rows={4}
              placeholder="Особливості зберігання, примітки або інша важлива інформація..."
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
            />
          </section>
        </div>
      </form>
    </Modal>
  );
};

export default EditMedicineModal;
