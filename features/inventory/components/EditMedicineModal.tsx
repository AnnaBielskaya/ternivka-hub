"use client";

import type { FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";
import DropdownSelect from "@/components/ui/DropdownSelect";
import FormField from "@/components/ui/FormField";
import FormSection from "@/components/ui/FormSection";

import type {
  InventoryItem,
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import { INPUT_CLASS_NAME } from "@/features/inventory/constants";

import { useEditMedicineForm } from "@/features/inventory/hooks/useEditMedicineForm";

type EditMedicineModalProps = {
  item: InventoryItem;
  medicineForms: MedicineFormRow[];
  medicinePurposes: MedicinePurposeRow[];
  onClose: () => void;
  onSaved: () => void;
};

const EditMedicineModal = ({
  item,
  medicineForms,
  medicinePurposes,
  onClose,
  onSaved,
}: EditMedicineModalProps) => {
  const {
    name,
    setName,
    activeIngredient,
    setActiveIngredient,
    formId,
    purposeId,
    setPurposeId,
    dosage,
    setDosage,
    volume,
    setVolume,
    unit,
    setUnit,
    minimumQuantity,
    setMinimumQuantity,
    description,
    setDescription,
    selectedForm,
    formOptions,
    purposeOptions,
    unitOptions,
    isPending,
    handleFormChange,
    handleSubmit,
  } = useEditMedicineForm({
    item,
    medicineForms,
    medicinePurposes,
  });

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    handleSubmit(event, onSaved);
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
      <form id="edit-medicine-form" onSubmit={submitForm}>
        <div className="space-y-7 p-4 sm:p-6">
          <FormSection
            title="Основна інформація"
            description="Основні характеристики препарату"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2 lg:col-span-3">
                <FormField label="Назва" htmlFor="edit-name" required>
                  <input
                    id="edit-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    disabled={isPending}
                    className={INPUT_CLASS_NAME}
                  />
                </FormField>
              </div>

              <FormField
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
              </FormField>

              <FormField label="Форма випуску" required>
                <DropdownSelect
                  value={formId || null}
                  options={formOptions}
                  placeholder="Оберіть форму"
                  variant="outline"
                  disabled={isPending}
                  onChange={handleFormChange}
                />
              </FormField>

              <FormField label="Призначення">
                <DropdownSelect
                  value={purposeId || null}
                  options={purposeOptions}
                  placeholder="Не обрано"
                  variant="outline"
                  disabled={isPending}
                  onChange={(value) => setPurposeId(value ?? "")}
                />
              </FormField>
            </div>
          </FormSection>

          <div className="border-t border-gray-100" />

          <FormSection
            title="Характеристики"
            description="Дозування та фізичні характеристики препарату"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormField label="Дозування" htmlFor="edit-dosage">
                <input
                  id="edit-dosage"
                  value={dosage}
                  onChange={(event) => setDosage(event.target.value)}
                  disabled={isPending}
                  className={INPUT_CLASS_NAME}
                />
              </FormField>

              <FormField label="Обʼєм" htmlFor="edit-volume">
                <input
                  id="edit-volume"
                  value={volume}
                  onChange={(event) => setVolume(event.target.value)}
                  disabled={isPending}
                  className={INPUT_CLASS_NAME}
                />
              </FormField>

              <FormField label="Одиниця обліку" required>
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
              </FormField>
            </div>
          </FormSection>

          <div className="border-t border-gray-100" />

          <FormSection
            title="Поповнення запасу"
            description="Контроль мінімального залишку"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormField
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
              </FormField>
            </div>
          </FormSection>

          <div className="border-t border-gray-100" />

          <FormSection
            title="Опис"
            description="Додаткова інформація про препарат"
          >
            <textarea
              id="edit-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isPending}
              rows={4}
              placeholder="Особливості зберігання, примітки або інша важлива інформація..."
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
            />
          </FormSection>
        </div>
      </form>
    </Modal>
  );
};

export default EditMedicineModal;
