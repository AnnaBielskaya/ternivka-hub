import { getMedicalItems } from "@/features/inventory/queries/item.queries";
import { getMedicineForms } from "@/features/inventory/queries/medicine-form.queries";
import { mapInventoryItem } from "@/features/inventory/utils/map-inventory-item";

import Header from "@/components/inventory/Header";

import AddItemButton from "./AddItemButton";
import MedsTableClient from "./MedsTableClient";

const MedsTable = async () => {
  const [items, medicineForms] = await Promise.all([
    getMedicalItems(),
    getMedicineForms(),
  ]);

  const inventoryItems = items.map(mapInventoryItem);

  return (
    <>
      <div className="flex items-center justify-between">
        <Header variant="medicine" />

        <AddItemButton
          variant="medicine"
          medicineForms={medicineForms}
        />
      </div>

      <MedsTableClient items={inventoryItems} />
    </>
  );
};

export default MedsTable;