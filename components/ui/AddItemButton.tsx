"use client";

import { useState } from "react";

import type {
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import type { SupplyCategory } from "@/features/inventory/supplies/types";

import CustomButton from "@/components/ui/CustomButton";
import AddItemModal from "./AddItemModal";

const ADD_ITEM_CONFIG = {
  medicine: {
    title: "Додати препарат",
  },
  supplies: {
    title: "Додати розхідник",
  },
  equipment: {
    title: "Додати обладнання",
  },
} as const;

type AddItemButtonProps = {
  variant: keyof typeof ADD_ITEM_CONFIG;
  medicineForms?: MedicineFormRow[];
  medicinePurposes?: MedicinePurposeRow[];
  supplyCategories?: SupplyCategory[];
};

const AddItemButton = ({
  variant,
  medicineForms = [],
  medicinePurposes = [],
  supplyCategories = [],
}: AddItemButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { title } = ADD_ITEM_CONFIG[variant];

  return (
    <>
      <CustomButton
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={title}
        className="h-10 w-10 rounded-lg bg-blue-600 px-0 text-lg font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] sm:h-10 sm:w-auto sm:gap-2 sm:px-4 sm:text-sm"
      >
        <span className="leading-none">+</span>

        <span className="hidden sm:inline">{title}</span>
      </CustomButton>

      <AddItemModal
        variant={variant}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        medicineForms={medicineForms}
        medicinePurposes={medicinePurposes}
        supplyCategories={supplyCategories}
      />
    </>
  );
};

export default AddItemButton;
