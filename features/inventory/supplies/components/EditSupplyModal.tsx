"use client";

import { useActionState, useEffect, useState } from "react";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";
import DropdownSelect from "@/components/ui/DropdownSelect";
import FormField from "@/components/ui/FormField";
import FormSection from "@/components/ui/FormSection";

import { INPUT_CLASS_NAME } from "@/features/inventory/constants";

import { updateSupply, type SupplyUpdateState } from "../actions/update-supply";

import { SUPPLY_UNIT_LABELS } from "../constants";
import type { SupplyUnit } from "../constants";

import type { SupplyCategory, SupplyItem } from "../types";

type EditSupplyModalProps = {
  item: SupplyItem;
  categories: SupplyCategory[];
  onClose: () => void;
  onSaved: () => void;
};

type SupplyFormValues = {
  name: string;
  category_id: string;
  quantity: string;
  unit: SupplyUnit;
  minimum_quantity: string;
  comment: string;
};

const EditSupplyModal = ({
  item,
  categories,
  onClose,
  onSaved,
}: EditSupplyModalProps) => {
  const [form, setForm] = useState<SupplyFormValues>({
    name: item.name,
    category_id: item.category?.id ?? "",
    quantity: String(item.quantity),
    unit: item.unit,
    minimum_quantity: String(item.minimum_quantity),
    comment: item.comment ?? "",
  });

  const initialState: SupplyUpdateState = {
    status: "idle",
    message: "",
  };

  const [state, formAction, isPending] = useActionState<
    SupplyUpdateState,
    FormData
  >(updateSupply, initialState);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    onSaved();
  }, [state.status, onSaved]);

  const updateField = <K extends keyof SupplyFormValues>(
    field: K,
    value: SupplyFormValues[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const unitOptions = (
    Object.entries(SUPPLY_UNIT_LABELS) as [SupplyUnit, string][]
  ).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <Modal
      isOpen={true}
      title="Редагувати розхідник"
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <CustomButton
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Скасувати
          </CustomButton>

          <CustomButton
            type="submit"
            form="edit-supply-form"
            disabled={isPending}
          >
            {isPending ? "Збереження..." : "Зберегти"}
          </CustomButton>
        </div>
      }
    >
      <form id="edit-supply-form" action={formAction}>
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="category_id" value={form.category_id} />
        <input type="hidden" name="unit" value={form.unit} />

        <div className="space-y-7 p-4 sm:p-6">
          <FormSection
            title="Основна інформація"
            description="Основні характеристики медичного розхідника"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2 lg:col-span-3">
                <FormField label="Назва" htmlFor="name" required>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    disabled={isPending}
                    className={INPUT_CLASS_NAME}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                  />
                </FormField>
              </div>

              <FormField label="Категорія" required>
                <DropdownSelect
                  value={form.category_id || null}
                  options={categoryOptions}
                  placeholder="Оберіть категорію"
                  variant="outline"
                  disabled={isPending}
                  onChange={(value) => updateField("category_id", value ?? "")}
                />
              </FormField>
            </div>
          </FormSection>

          <div className="border-t border-gray-100" />

          <FormSection
            title="Залишок"
            description="Фактична кількість та мінімальний залишок"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormField label="Кількість" htmlFor="quantity" required>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
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
                  value={form.unit}
                  options={unitOptions}
                  placeholder="Оберіть одиницю"
                  variant="outline"
                  disabled={isPending}
                  onChange={(value) =>
                    updateField("unit", (value ?? "piece") as SupplyUnit)
                  }
                />
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
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Статус визначається автоматично за фактичною та мінімальною
              кількістю.
            </p>
          </FormSection>

          <div className="border-t border-gray-100" />

          <FormSection
            title="Коментар"
            description="Додаткова інформація про медичний розхідник"
          >
            <FormField label="Коментар" htmlFor="comment">
              <textarea
                id="comment"
                name="comment"
                rows={3}
                value={form.comment}
                disabled={isPending}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
                onChange={(event) => updateField("comment", event.target.value)}
              />
            </FormField>
          </FormSection>

          {state.message ? (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                state.status === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {state.message}
            </div>
          ) : null}
        </div>
      </form>
    </Modal>
  );
};

export default EditSupplyModal;
