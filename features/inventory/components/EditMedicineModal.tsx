import React from "react";

interface EditMedicineModalProps {
  item: any; // Replace 'any' with the actual type of 'item'
  medicineForms: any[]; // Replace 'any[]' with the actual type of 'medicineForms'
  medicinePurposes: any[]; // Replace 'any[]' with the actual type of 'medicinePurposes'
  onClose: () => void;
  onSaved: () => void;
}

const EditMedicineModal = ({
  item,
  medicineForms,
  medicinePurposes,
  onClose,
  onSaved,
}: EditMedicineModalProps) => {
  return <div>EditMedicineModal</div>;
};

export default EditMedicineModal;
