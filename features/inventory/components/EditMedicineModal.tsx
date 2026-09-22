"use client";

import { useEffect, useState, useTransition } from "react";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";
import type {
  InventoryItem,
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import { updateMedicine } from "@/features/inventory/actions/update-medicine";

const INVENTORY_UNITS = [
  { value: "блістер", label: "Блістер" },
  { value: "упаковка", label: "Упаковка" },
  { value: "ампули", label: "Ампули" },
  { value: "грам", label: "Грам" },
  { value: "штука", label: "Штука" },
] as const;

type EditMedicineModalProps = {
  item: InventoryItem;
  medicineForms: MedicineFormRow[];
  medicinePurposes: MedicinePurposeRow[];
  onClose: () => void;
  onSaved: () => void;
};

const inputClassName =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100";

const selectClassName =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100";

const labelClassName = "mb-1.5 block text-sm font-medium text-gray-700";

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

  useEffect(() => {
    const selectedForm = medicineForms.find((form) => form.id === formId);

    if (!selectedForm) {
      return;
    }

    const allowedUnits =
      selectedForm.name === "Таблетки"
        ? ["блістер", "упаковка"]
        : selectedForm.name === "Мазь"
        ? ["штука"]
        : selectedForm.name === "Краплі"
        ? ["штука"]
        : selectedForm.name === "Розчин"
        ? ["ампули"]
        : selectedForm.name === "Саше"
        ? ["штука", "упаковка"]
        : ["штука", "упаковка"];

    if (!allowedUnits.includes(unit)) {
      setUnit(allowedUnits[0]);
    }
  }, [formId, medicineForms, unit]);

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
        <div className="space-y-6 p-6">
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
                <label htmlFor="edit-name" className={labelClassName}>
                  Назва <span className="text-red-500">*</span>
                </label>

                <input
                  id="edit-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="edit-active-ingredient"
                  className={labelClassName}
                >
                  Діюча речовина
                </label>

                <input
                  id="edit-active-ingredient"
                  value={activeIngredient}
                  onChange={(event) => setActiveIngredient(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="edit-form" className={labelClassName}>
                  Форма випуску <span className="text-red-500">*</span>
                </label>

                <select
                  id="edit-form"
                  value={formId}
                  onChange={(event) => setFormId(event.target.value)}
                  required
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
                <label htmlFor="edit-purpose" className={labelClassName}>
                  Призначення
                </label>

                <select
                  id="edit-purpose"
                  value={purposeId}
                  onChange={(event) => setPurposeId(event.target.value)}
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
                Дозування та фізичні характеристики препарату
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="edit-dosage" className={labelClassName}>
                  Дозування
                </label>

                <input
                  id="edit-dosage"
                  value={dosage}
                  onChange={(event) => setDosage(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="edit-volume" className={labelClassName}>
                  Обʼєм
                </label>

                <input
                  id="edit-volume"
                  value={volume}
                  onChange={(event) => setVolume(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="edit-unit" className={labelClassName}>
                  Одиниця обліку <span className="text-red-500">*</span>
                </label>

                <select
                  id="edit-unit"
                  value={unit}
                  onChange={(event) => setUnit(event.target.value)}
                  required
                  className={selectClassName}
                >
                  {INVENTORY_UNITS.map((inventoryUnit) => (
                    <option
                      key={inventoryUnit.value}
                      value={inventoryUnit.value}
                    >
                      {inventoryUnit.label}
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
                Поповнення запасу
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Контроль мінімального залишку
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="edit-minimum-quantity"
                  className={labelClassName}
                >
                  Мінімальний залишок
                </label>

                <input
                  id="edit-minimum-quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={minimumQuantity}
                  onChange={(event) => setMinimumQuantity(event.target.value)}
                  className={inputClassName}
                />
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
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </section>
        </div>
      </form>
    </Modal>
  );
};

export default EditMedicineModal;
