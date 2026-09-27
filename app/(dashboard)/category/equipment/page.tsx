import Header from "@/components/ui/Header";
import AddItemButton from "@/components/ui/AddItemButton";

import EquipmentTableClient from "@/features/inventory/equipment/components/EquipmentTableClient";
import { getEquipmentItems } from "@/features/inventory/equipment/queries/equipment.queries";

const Equipment = async () => {
  const [items] = await Promise.all([getEquipmentItems()]);

  return (
    <>
      <div className="flex items-center justify-between gap-1">
        <Header variant="equipment" />

        <AddItemButton variant="equipment" />
      </div>

      <EquipmentTableClient items={items} />
    </>
  );
};

export default Equipment;
