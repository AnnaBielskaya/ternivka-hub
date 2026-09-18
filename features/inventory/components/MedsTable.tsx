import { getMedicalItems } from "@/features/inventory/queries/item.queries";
import { mapInventoryItem } from "@/features/inventory/utils/map-inventory-item";

import Header from "@/components/inventory/Header";

import AddItemButton from "./AddItemButton";
import MedsTableClient from "./MedsTableClient.tsx";

const MedsTable = async () => {
  const items = await getMedicalItems();
  const inventoryItems = items.map(mapInventoryItem);

  return (
    <>
      <div className="flex items-center justify-between">
        <Header variant="medicine" />
        <AddItemButton variant="medicine" />
      </div>

      <MedsTableClient items={inventoryItems} />
    </>
  );
};

export default MedsTable;