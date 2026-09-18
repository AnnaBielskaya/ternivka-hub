"use client";

import type {
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import MedicineForm from "@/features/inventory/forms/MedicineForm";
import Modal from "@/components/ui/Modal";

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
  medicinePurposes?: MedicinePurposeRow[];
};

const AddItemModal = ({
  variant,
  isOpen,
  onClose,
  medicineForms = [],
  medicinePurposes = [],
}: AddItemModalProps) => {
  const { title } = MODAL_CONFIG[variant];

  const footer =
    variant === "medicine" ? (
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="h-10 cursor-pointer rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Скасувати
        </button>

        <button
          type="submit"
          form="medicine-form"
          className="h-10 cursor-pointer rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Додати препарат
        </button>
      </div>
    ) : null;

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      footer={footer}
    >
      {variant === "medicine" && (
        <MedicineForm
          medicineForms={medicineForms}
          medicinePurposes={medicinePurposes}
        />
      )}
    </Modal>
  );
};

export default AddItemModal;