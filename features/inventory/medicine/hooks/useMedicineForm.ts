"use client";

import { useActionState, useState } from "react";

import type {
  MedicalItemRow,
  MedicineCreateState,
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import {
  INVENTORY_UNITS,
  MEDICINE_UNITS_BY_FORM,
  MONTHS,
} from "@/features/inventory/constants";

import { createMedicine } from "@/features/inventory/medicine/actions/create-medicine";

const initialMedicineCreateState: MedicineCreateState = {
  status: "idle",
  message: "",
};

type MedicineFormValues = {
  name: string;
  active_ingredient: string;
  form_id: string;
  purpose_id: string;
  dosage: string;
  volume: string;
  quantity: string;
  unit: string;
  minimum_quantity: string;
  expiry_month: string;
  expiry_year: string;
  description: string;
};

const EMPTY_FORM: MedicineFormValues = {
  name: "",
  active_ingredient: "",
  form_id: "",
  purpose_id: "",
  dosage: "",
  volume: "",
  quantity: "0",
  unit: "",
  minimum_quantity: "0",
  expiry_month: "",
  expiry_year: "",
  description: "",
};

type UseMedicineFormProps = {
  medicineForms: MedicineFormRow[];
  medicinePurposes: MedicinePurposeRow[];
};

const getMedicineQuantity = (stock: MedicalItemRow["stock"]) => {
  return stock.reduce((total, item) => total + Number(item.quantity), 0);
};

const getNearestStock = (stock: MedicalItemRow["stock"]) => {
  return (
    [...stock]
      .filter((item) => Number(item.quantity) > 0)
      .sort((a, b) => {
        const dateA = a.expiry_year * 100 + a.expiry_month;
        const dateB = b.expiry_year * 100 + b.expiry_month;

        return dateA - dateB;
      })[0] ?? null
  );
};

export const useMedicineForm = ({
  medicineForms,
  medicinePurposes,
}: UseMedicineFormProps) => {
  const [form, setForm] = useState<MedicineFormValues>(EMPTY_FORM);

  const [state, formAction, isPending] = useActionState(
    createMedicine,
    initialMedicineCreateState
  );

  const selectedForm = medicineForms.find(
    (medicineForm) => medicineForm.id === form.form_id
  );

  const availableUnitValues = selectedForm
    ? MEDICINE_UNITS_BY_FORM[
        selectedForm.name as keyof typeof MEDICINE_UNITS_BY_FORM
      ] ?? []
    : [];

  const availableUnits = INVENTORY_UNITS.filter((inventoryUnit) =>
    availableUnitValues.includes(inventoryUnit.value as never)
  );

  const updateField = <K extends keyof MedicineFormValues>(
    field: K,
    value: MedicineFormValues[K]
  ) => {
    if (field === "form_id") {
      const formId = value as string;

      const nextForm = medicineForms.find(
        (medicineForm) => medicineForm.id === formId
      );

      if (!nextForm) {
        setForm((current) => ({
          ...current,
          form_id: formId,
          unit: "",
        }));

        return;
      }

      const allowedUnits =
        MEDICINE_UNITS_BY_FORM[
          nextForm.name as keyof typeof MEDICINE_UNITS_BY_FORM
        ] ?? [];

      setForm((current) => ({
        ...current,
        form_id: formId,
        unit: allowedUnits.includes(current.unit as never)
          ? current.unit
          : allowedUnits[0] ?? "",
      }));

      return;
    }

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSelectMedicine = (medicine: MedicalItemRow) => {
    const quantity = getMedicineQuantity(medicine.stock);
    const nearestStock = getNearestStock(medicine.stock);

    setForm({
      name: medicine.name,
      active_ingredient: medicine.active_ingredient ?? "",
      form_id: medicine.medicine_form?.id ?? "",
      purpose_id: medicine.medicine_purpose?.id ?? "",
      dosage: medicine.dosage ?? "",
      volume: medicine.volume ?? "",
      quantity: String(quantity),
      unit: medicine.unit,
      minimum_quantity: String(medicine.minimum_quantity),
      expiry_month: nearestStock ? String(nearestStock.expiry_month) : "",
      expiry_year: nearestStock ? String(nearestStock.expiry_year) : "",
      description: medicine.description ?? "",
    });
  };

  const formOptions = medicineForms.map((medicineForm) => ({
    value: medicineForm.id,
    label: medicineForm.name,
  }));

  const purposeOptions = [
    {
      value: "",
      label: "Не обрано",
    },
    ...medicinePurposes.map((purpose) => ({
      value: purpose.id,
      label: purpose.name,
    })),
  ];

  const unitOptions = availableUnits.map((inventoryUnit) => ({
    value: inventoryUnit.value,
    label: inventoryUnit.label,
  }));

  const monthOptions = MONTHS.map((month) => ({
    value: String(month),
    label: String(month).padStart(2, "0"),
  }));

  return {
    form,
    state,
    formAction,
    isPending,

    selectedForm,
    availableUnits,

    formOptions,
    purposeOptions,
    unitOptions,
    monthOptions,

    updateField,
    handleSelectMedicine,
  };
};
