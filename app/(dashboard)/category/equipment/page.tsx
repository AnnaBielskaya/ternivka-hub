import Header from "@/components/ui/Header";
import AddItemButton from "@/components/ui/AddItemButton";

import EquipmentTableClient from "@/features/inventory/equipment/components/EquipmentTableClient";
import { getEquipmentItems } from "@/features/inventory/equipment/queries/equipment.queries";
import { getCurrentUser } from "@/features/auth/actions/get-current-user";

const Equipment = async () => {
  const [items, user] = await Promise.all([
    getEquipmentItems(),
    getCurrentUser(),
  ]);

  return (
    <>
      <div className="flex items-center justify-between gap-1">
        <Header variant="equipment" />

        <AddItemButton variant="equipment" />
      </div>

      <EquipmentTableClient items={items} role={user.role} />
    </>
  );
};

export default Equipment;
