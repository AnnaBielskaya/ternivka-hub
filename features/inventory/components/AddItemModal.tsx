"use client";

import { useCallback, useState } from "react";

import type {
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import MedicineForm from "@/features/inventory/forms/MedicineForm";
import Modal from "@/components/ui/Modal";

const MODAL_CONFIG = {
  medicine: {
    title: "Додати препарат",
    submitLabel: "Додати препарат",
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
  const [formVersion, setFormVersion] =
    useState(0);

  const handleClose = useCallback(() => {
    setFormVersion(
      (current) => current + 1,
    );

    onClose();
  }, [onClose]);

  const handleSaved = useCallback(() => {
    setFormVersion(
      (current) => current + 1,
    );

    onClose();
  }, [onClose]);

  const config = MODAL_CONFIG[variant];

  const footer =
    variant === "medicine" ? (
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleClose}
          className="h-10 cursor-pointer rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Скасувати
        </button>

        <button
          type="submit"
          form="medicine-form"
          className="h-10 cursor-pointer rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          {MODAL_CONFIG.medicine.submitLabel}
        </button>
      </div>
    ) : null;

  return (
    <Modal
      isOpen={isOpen}
      title={config.title}
      onClose={handleClose}
      footer={footer}
    >
      {variant === "medicine" && (
        <MedicineForm
          key={formVersion}
          medicineForms={medicineForms}
          medicinePurposes={medicinePurposes}
          onSaved={handleSaved}
        />
      )}
    </Modal>
  );
};

export default AddItemModal;