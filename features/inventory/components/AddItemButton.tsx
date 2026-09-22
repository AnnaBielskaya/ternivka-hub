"use client";

import { useState } from "react";

import type {
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import CustomButton from "@/components/ui/CustomButton";
import AddItemModal from "./AddItemModal";

const ADD_ITEM_CONFIG = {
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

type AddItemButtonProps = {
  variant: keyof typeof ADD_ITEM_CONFIG;
  medicineForms?: MedicineFormRow[];
  medicinePurposes?: MedicinePurposeRow[];
};

const AddItemButton = ({
  variant,
  medicineForms = [],
  medicinePurposes = [],
}: AddItemButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { title } = ADD_ITEM_CONFIG[variant];

  return (
    <>
      <CustomButton
        type="button"
        onClick={() => setIsOpen(true)}
        className="h-10 gap-2 rounded-lg bg-gray-900 px-4 text-sm font-semibold shadow-sm hover:bg-gray-800 active:scale-[0.98]"
      >
        <span className="text-lg leading-none">+</span>
        <span>{title}</span>
      </CustomButton>

      <AddItemModal
        variant={variant}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        medicineForms={medicineForms}
        medicinePurposes={medicinePurposes}
      />
    </>
  );
};

export default AddItemButton;
