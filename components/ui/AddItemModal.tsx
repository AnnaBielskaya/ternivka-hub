"use client";

import { useCallback, useState } from "react";

import type {
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import MedicineForm from "@/features/inventory/medicine/forms/MedicineForm";
import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";

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
  const [formVersion, setFormVersion] = useState(0);

  const handleClose = useCallback(() => {
    setFormVersion((current) => current + 1);
    onClose();
  }, [onClose]);

  const handleSaved = useCallback(() => {
    setFormVersion((current) => current + 1);
    onClose();
  }, [onClose]);

  const config = MODAL_CONFIG[variant];

  const footer =
    variant === "medicine" ? (
      <div className="flex justify-end gap-3">
        <CustomButton variant="secondary" onClick={handleClose}>
          Скасувати
        </CustomButton>

        <CustomButton type="submit" form="medicine-form">
          {MODAL_CONFIG.medicine.submitLabel}
        </CustomButton>
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
