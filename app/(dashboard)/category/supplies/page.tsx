import AddItemButton from "@/components/ui/AddItemButton";
import Header from "@/components/ui/Header";
import { getSupplyItems } from "@/features/inventory/supplies/actions/get-supply-items";
import SuppliesTableClient from "@/features/inventory/supplies/components/SuppliesTableClient";

const MedicalSupplies = async () => {
  const items = await getSupplyItems();

  return (
    <>
      <div className="flex items-center justify-between gap-1">
        <Header variant="supplies" />

        <AddItemButton variant="supplies" />
      </div>
      <SuppliesTableClient items={items} />
    </>
  );
};

export default MedicalSupplies;
