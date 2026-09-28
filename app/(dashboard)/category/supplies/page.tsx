import AddItemButton from "@/components/ui/AddItemButton";
import Header from "@/components/ui/Header";
import SuppliesTableClient from "@/features/inventory/supplies/components/SuppliesTableClient";

const MedicalSupplies = () => {
  return (
    <>
      <div className="flex items-center justify-between gap-1">
        <Header variant="supplies" />

        <AddItemButton variant="supplies" />
      </div>
      <SuppliesTableClient />
    </>
  );
};

export default MedicalSupplies;
