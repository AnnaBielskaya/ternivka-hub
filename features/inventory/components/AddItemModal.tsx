"use client";

import type { MedicineFormRow } from "@/features/inventory/types";
import MedicineForm from "@/features/inventory/forms/MedicineForm";

const MODAL_CONFIG = {
  medicine: {
    title: "Додати препарат",
  },
  medicalsupplies: {
    title: "Додати медичний розхідник",
  },
  equipment: {
    title: "Додати медичне обладнання",
  },
} as const;

type AddItemModalProps = {
  variant: keyof typeof MODAL_CONFIG;
  isOpen: boolean;
  onClose: () => void;
  medicineForms?: MedicineFormRow[];
};

const AddItemModal = ({
  variant,
  isOpen,
  onClose,
  medicineForms = [],
}: AddItemModalProps) => {
  if (!isOpen) {
    return null;
  }

  const { title } = MODAL_CONFIG[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Закрити"
          >
            ×
          </button>
        </div>

        {variant === "medicine" && (
          <MedicineForm
            onCancel={onClose}
            medicineForms={medicineForms}
          />
        )}
      </div>
    </div>
  );
};

export default AddItemModal;