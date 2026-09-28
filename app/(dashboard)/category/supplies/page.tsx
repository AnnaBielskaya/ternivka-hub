import AddItemButton from "@/components/ui/AddItemButton";
import Header from "@/components/ui/Header";
import { getCurrentUser } from "@/features/auth/actions/get-current-user";
import { getSupplyCategories } from "@/features/inventory/supplies/actions/get-supply-categories";
import { getSupplyItems } from "@/features/inventory/supplies/actions/get-supply-items";
import SuppliesTableClient from "@/features/inventory/supplies/components/SuppliesTableClient";

const MedicalSupplies = async () => {
  const [supplyCategories, items, user] = await Promise.all([
    getSupplyCategories(),
    getSupplyItems(),
    getCurrentUser(),
  ]);

  return (
    <>
      <div className="flex items-center justify-between gap-1">
        <Header variant="supplies" />

        <AddItemButton variant="supplies" supplyCategories={supplyCategories} />
      </div>

      <SuppliesTableClient
        items={items}
        categories={supplyCategories}
        role={user.role}
      />
    </>
  );
};

export default MedicalSupplies;
