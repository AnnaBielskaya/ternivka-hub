"use client";

import { useState } from "react";

import {
  EQUIPMENT_POWER_OPTIONS,
  EQUIPMENT_STATUS_OPTIONS,
} from "@/features/inventory/equipment/constants";
import {
  INPUT_CLASS_NAME,
  SELECT_CLASS_NAME,
} from "@/features/inventory/constants";

import DropdownSelect from "@/components/ui/DropdownSelect";
import FormField from "@/components/ui/FormField";
import FormSection from "@/components/ui/FormSection";

type EquipmentFormProps = {
  onSaved: () => void;
};

type EquipmentFormState = {
  name: string;
  status: string;
  power_source: string;
  quantity: string;
  comment: string;
};

const INITIAL_FORM: EquipmentFormState = {
  name: "",
  status: "working",
  power_source: "",
  quantity: "1",
  comment: "",
};

const EquipmentForm = ({ onSaved }: EquipmentFormProps) => {
  const [form, setForm] = useState<EquipmentFormState>(INITIAL_FORM);

  const [message, setMessage] = useState<string | null>(null);

  const updateField = (field: keyof EquipmentFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("Вкажіть назву обладнання");
      return;
    }

    if (!form.power_source) {
      setMessage("Оберіть тип живлення");
      return;
    }

    if (!form.quantity || Number(form.quantity) < 1) {
      setMessage("Кількість повинна бути не менше 1");
      return;
    }

    onSaved();
  };

  return (
    <form id="equipment-form" onSubmit={handleSubmit}>
      <div className="space-y-7 p-4 sm:p-6">
        <FormSection
          title="Основна інформація"
          description="Основні характеристики обладнання"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField label="Назва" htmlFor="equipment-name" required>
                <input
                  id="equipment-name"
                  name="name"
                  type="text"
                  value={form.name}
                  placeholder="Наприклад, дефібрилятор"
                  className={INPUT_CLASS_NAME}
                  onChange={(event) => updateField("name", event.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Стан" required>
              <DropdownSelect
                value={form.status || null}
                options={EQUIPMENT_STATUS_OPTIONS}
                placeholder="Оберіть стан"
                variant="outline"
                onChange={(value) => updateField("status", value ?? "")}
              />

              <input type="hidden" name="status" value={form.status} />
            </FormField>

            <FormField label="Живлення" required>
              <DropdownSelect
                value={form.power_source || null}
                options={EQUIPMENT_POWER_OPTIONS}
                placeholder="Оберіть тип живлення"
                variant="outline"
                onChange={(value) => updateField("power_source", value ?? "")}
              />

              <input
                type="hidden"
                name="power_source"
                value={form.power_source}
              />
            </FormField>
          </div>
        </FormSection>

        <div className="border-t border-gray-100" />

        <FormSection title="Облік" description="Фактична кількість обладнання">
          <FormField label="Кількість" htmlFor="equipment-quantity" required>
            <input
              id="equipment-quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              value={form.quantity}
              className={INPUT_CLASS_NAME}
              onChange={(event) => updateField("quantity", event.target.value)}
            />
          </FormField>
        </FormSection>

        <div className="border-t border-gray-100" />

        <FormSection
          title="Коментар"
          description="Додаткова інформація про обладнання"
        >
          <textarea
            id="equipment-comment"
            name="comment"
            rows={3}
            value={form.comment}
            placeholder="Наприклад, потребує перевірки або має особливості..."
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            onChange={(event) => updateField("comment", event.target.value)}
          />
        </FormSection>

        {message && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
          </div>
        )}
      </div>
    </form>
  );
};

export default EquipmentForm;
