"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { INPUT_CLASS_NAME } from "@/features/inventory/constants";

import DropdownSelect from "@/components/ui/DropdownSelect";
import FormField from "@/components/ui/FormField";
import FormSection from "@/components/ui/FormSection";

import {
  createSupply,
  initialSupplyCreateState,
} from "@/features/inventory/supplies/actions/create-supply";

import type { SupplyCreateState } from "@/features/inventory/supplies/actions/create-supply";
import type { SupplyCategory } from "../types";

import { SUPPLY_UNIT_LABELS } from "../constants";
import type { SupplyUnit } from "../constants";

type SupplyFormProps = {
  categories: SupplyCategory[];
  onSaved: () => void;
};

type SupplyFormValues = {
  name: string;
  category_id: string;
  quantity: string;
  unit: string;
  minimum_quantity: string;
  comment: string;
};

const EMPTY_FORM: SupplyFormValues = {
  name: "",
  category_id: "",
  quantity: "1",
  unit: "piece",
  minimum_quantity: "0",
  comment: "",
};

const SupplyForm = ({ categories, onSaved }: SupplyFormProps) => {
  const router = useRouter();

  const [form, setForm] = useState<SupplyFormValues>(EMPTY_FORM);

  const [state, formAction, isPending] = useActionState<
    SupplyCreateState,
    FormData
  >(createSupply, initialSupplyCreateState);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    router.refresh();
    onSaved();
  }, [state.status, router, onSaved]);

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
    <form id="supply-form" action={formAction}>
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
                  placeholder="Наприклад, нітрилові рукавички"
                  className={INPUT_CLASS_NAME}
                  onChange={(event) => updateField("name", event.target.value)}
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

              <input
                type="hidden"
                name="category_id"
                value={form.category_id}
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
                value={form.unit || null}
                options={unitOptions}
                placeholder="Оберіть одиницю"
                variant="outline"
                disabled={isPending}
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
              placeholder="Особливості, примітки або інша важлива інформація..."
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
  );
};

export default SupplyForm;
