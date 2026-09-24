"use client";

import { useEffect, useState, useTransition } from "react";

import type {
  InventoryItem,
  MedicineFormRow,
  MedicinePurposeRow,
} from "@/features/inventory/types";

import {
  INVENTORY_UNITS,
  MEDICINE_UNITS_BY_FORM,
} from "@/features/inventory/constants";

import { updateMedicine } from "@/features/inventory/medicine/actions/update-medicine";

type UseEditMedicineFormProps = {
  item: InventoryItem;
  medicineForms: MedicineFormRow[];
  medicinePurposes: MedicinePurposeRow[];
};

const getAllowedUnits = (formName: string) => {
  return (
    MEDICINE_UNITS_BY_FORM[formName as keyof typeof MEDICINE_UNITS_BY_FORM] ??
    []
  );
};

export const useEditMedicineForm = ({
  item,
  medicineForms,
  medicinePurposes,
}: UseEditMedicineFormProps) => {
  const [name, setName] = useState(item.name);

  const [activeIngredient, setActiveIngredient] = useState(
    item.active_ingredient ?? ""
  );

  const [formId, setFormId] = useState(item.medicine_form?.id ?? "");

  const [purposeId, setPurposeId] = useState(item.medicine_purpose?.id ?? "");

  const [dosage, setDosage] = useState(item.dosage ?? "");

  const [volume, setVolume] = useState(item.volume ?? "");

  const [unit, setUnit] = useState(item.unit);

  const [minimumQuantity, setMinimumQuantity] = useState(
    String(item.minimum_quantity)
  );

  const [description, setDescription] = useState(item.description ?? "");

  const [isPending, startTransition] = useTransition();

  const selectedForm = medicineForms.find((form) => form.id === formId);

  const availableUnitValues = selectedForm
    ? getAllowedUnits(selectedForm.name)
    : [];

  const availableUnits = INVENTORY_UNITS.filter((inventoryUnit) =>
    availableUnitValues.includes(inventoryUnit.value as never)
  );

  const formOptions = medicineForms.map((form) => ({
    value: form.id,
    label: form.name,
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

  useEffect(() => {
    if (!selectedForm) {
      if (unit !== "") {
        setUnit("");
      }

      return;
    }

    const allowedUnits = getAllowedUnits(selectedForm.name);

    if (!allowedUnits.includes(unit as never)) {
      setUnit(allowedUnits[0] ?? "");
    }
  }, [selectedForm, unit]);

  const handleFormChange = (value: string | null) => {
    const nextFormId = value ?? "";

    setFormId(nextFormId);

    const nextForm = medicineForms.find((form) => form.id === nextFormId);

    if (!nextForm) {
      setUnit("");
      return;
    }

    const allowedUnits = getAllowedUnits(nextForm.name);

    if (!allowedUnits.includes(unit as never)) {
      setUnit(allowedUnits[0] ?? "");
    }
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    onSaved: () => void
  ) => {
    event.preventDefault();

    const formData = new FormData();

    formData.set("name", name);
    formData.set("form_id", formId);
    formData.set("purpose_id", purposeId);
    formData.set("active_ingredient", activeIngredient);
    formData.set("dosage", dosage);
    formData.set("volume", volume);
    formData.set("unit", unit);
    formData.set("minimum_quantity", minimumQuantity);
    formData.set("description", description);

    startTransition(async () => {
      const result = await updateMedicine(item.id, formData);

      if (result.status === "error") {
        window.alert(result.message);
        return;
      }

      onSaved();
    });
  };

  return {
    name,
    setName,

    activeIngredient,
    setActiveIngredient,

    formId,

    purposeId,
    setPurposeId,

    dosage,
    setDosage,

    volume,
    setVolume,

    unit,
    setUnit,

    minimumQuantity,
    setMinimumQuantity,

    description,
    setDescription,

    selectedForm,
    formOptions,
    purposeOptions,
    unitOptions,

    isPending,

    handleFormChange,
    handleSubmit,
  };
};
