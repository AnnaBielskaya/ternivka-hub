"use client";

import { useState, useTransition } from "react";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";
import SectionDivider from "@/components/ui/SectionDivider";
import SectionTitle from "@/components/ui/SectionTitle";

import type {
  EquipmentItem,
  EquipmentPowerSource,
  EquipmentStatus,
} from "../types";

import { EQUIPMENT_POWER_LABELS, EQUIPMENT_STATUS_LABELS } from "../constants";

import { updateEquipment } from "../actions/update-equipment";

type EditEquipmentModalProps = {
  item: EquipmentItem;
  onClose: () => void;
  onSaved: () => void;
};

const INPUT_CLASS_NAME =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50";

const SELECT_CLASS_NAME =
  "h-10 w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50";

const EditEquipmentModal = ({
  item,
  onClose,
  onSaved,
}: EditEquipmentModalProps) => {
  const [name, setName] = useState(item.name);
  const [status, setStatus] = useState<EquipmentStatus>(item.status);
  const [powerSource, setPowerSource] = useState<EquipmentPowerSource>(
    item.power_source
  );
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [comment, setComment] = useState(item.comment ?? "");

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    formData.set("name", name);
    formData.set("status", status);
    formData.set("power_source", powerSource);
    formData.set("quantity", quantity);
    formData.set("comment", comment);

    startTransition(async () => {
      const result = await updateEquipment(item.id, formData);

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
      title="Редагувати обладнання"
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
            form="edit-equipment-form"
            disabled={isPending}
          >
            {isPending ? "Збереження..." : "Зберегти"}
          </CustomButton>
        </div>
      }
    >
      <form id="edit-equipment-form" onSubmit={handleSubmit}>
        <div className="space-y-5 p-4 sm:p-5">
          <section>
            <SectionTitle title="Основна інформація" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="equipment-name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Назва
                </label>

                <input
                  id="equipment-name"
                  type="text"
                  value={name}
                  disabled={isPending}
                  className={INPUT_CLASS_NAME}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="equipment-status"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Статус
                </label>

                <select
                  id="equipment-status"
                  value={status}
                  disabled={isPending}
                  className={SELECT_CLASS_NAME}
                  onChange={(event) =>
                    setStatus(event.target.value as EquipmentStatus)
                  }
                >
                  {(
                    Object.keys(EQUIPMENT_STATUS_LABELS) as EquipmentStatus[]
                  ).map((value) => (
                    <option key={value} value={value}>
                      {EQUIPMENT_STATUS_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="equipment-power-source"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Джерело живлення
                </label>

                <select
                  id="equipment-power-source"
                  value={powerSource}
                  disabled={isPending}
                  className={SELECT_CLASS_NAME}
                  onChange={(event) =>
                    setPowerSource(event.target.value as EquipmentPowerSource)
                  }
                >
                  {(
                    Object.keys(
                      EQUIPMENT_POWER_LABELS
                    ) as EquipmentPowerSource[]
                  ).map((value) => (
                    <option key={value} value={value}>
                      {EQUIPMENT_POWER_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="equipment-quantity"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Кількість
                </label>

                <input
                  id="equipment-quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  disabled={isPending}
                  className={INPUT_CLASS_NAME}
                  onChange={(event) => setQuantity(event.target.value)}
                />
              </div>
            </div>
          </section>

          <SectionDivider />

          <section>
            <SectionTitle title="Коментар" />

            <textarea
              id="equipment-comment"
              rows={4}
              value={comment}
              disabled={isPending}
              placeholder="Додаткова інформація про обладнання..."
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
              onChange={(event) => setComment(event.target.value)}
            />
          </section>
        </div>
      </form>
    </Modal>
  );
};

export default EditEquipmentModal;
