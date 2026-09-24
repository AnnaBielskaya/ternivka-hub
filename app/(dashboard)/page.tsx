import { getCurrentUser } from "@/features/auth/actions/get-current-user";

import Header from "@/components/ui/Header";

import AddItemButton from "@/components/ui/AddItemButton";
import MedsTableClient from "@/features/inventory/components/MedsTableClient";

import { mapInventoryItem } from "@/features/inventory/utils/map-inventory-item";
import { getMedicalItems } from "@/features/inventory/medicine/queries/item.queries";
import { getMedicineForms } from "@/features/inventory/medicine/queries/medicine-form.queries";
import { getMedicinePurposes } from "@/features/inventory/medicine/queries/medicine-purpose.queries";

export default async function HomePage() {
  const [items, medicineForms, medicinePurposes, user] = await Promise.all([
    getMedicalItems(),
    getMedicineForms(),
    getMedicinePurposes(),
    getCurrentUser(),
  ]);

  const inventoryItems = items.map(mapInventoryItem);

  return (
    <>
      <div className="flex items-center gap-1 justify-between">
        <Header variant="medicine" />

        <AddItemButton
          variant="medicine"
          medicineForms={medicineForms}
          medicinePurposes={medicinePurposes}
        />
      </div>

      <MedsTableClient
        items={inventoryItems}
        role={user.role}
        medicineForms={medicineForms}
        medicinePurposes={medicinePurposes}
      />
    </>
  );
}
