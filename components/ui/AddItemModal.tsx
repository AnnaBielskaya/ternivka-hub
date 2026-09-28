"use client";

import { useCallback, useState } from "react";

import type {
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import MedicineForm from "@/features/inventory/medicine/forms/MedicineForm";
import EquipmentForm from "@/features/inventory/equipment/components/EquipmentForm";
import SupplyForm from "@/features/inventory/supplies/components/SupplyForm";

import type { SupplyCategory } from "@/features/inventory/supplies/types";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";

const MODAL_CONFIG = {
  medicine: {
    title: "Додати препарат",
    submitLabel: "Додати препарат",
    formId: "medicine-form",
  },
  supplies: {
    title: "Додати медичний розхідник",
    submitLabel: "Додати розхідник",
    formId: "supply-form",
  },
  equipment: {
    title: "Додати медичне обладнання",
    submitLabel: "Додати обладнання",
    formId: "equipment-form",
  },
} as const;

type AddItemModalProps = {
  variant: keyof typeof MODAL_CONFIG;
  isOpen: boolean;
  onClose: () => void;
  medicineForms?: MedicineFormRow[];
  medicinePurposes?: MedicinePurposeRow[];
  supplyCategories?: SupplyCategory[];
};

const AddItemModal = ({
  variant,
  isOpen,
  onClose,
  medicineForms = [],
  medicinePurposes = [],
  supplyCategories = [],
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

  const footer = (
    <div className="flex justify-end gap-3">
      <CustomButton variant="secondary" onClick={handleClose}>
        Скасувати
      </CustomButton>

      <CustomButton type="submit" form={config.formId}>
        {config.submitLabel}
      </CustomButton>
    </div>
  );

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

      {variant === "equipment" && (
        <EquipmentForm key={formVersion} onSaved={handleSaved} />
      )}

      {variant === "supplies" && (
        <SupplyForm
          key={formVersion}
          categories={supplyCategories}
          onSaved={handleSaved}
        />
      )}
    </Modal>
  );
};

export default AddItemModal;
