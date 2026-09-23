import { getMedicalItems } from "@/features/inventory/queries/item.queries";
import { getMedicineForms } from "@/features/inventory/queries/medicine-form.queries";
import { getMedicinePurposes } from "@/features/inventory/queries/medicine-purpose.queries";
import { getCurrentUser } from "@/features/auth/actions/get-current-user";

import Header from "@/components/inventory/Header";

import AddItemButton from "@/features/inventory/components/AddItemButton";
import MedsTableClient from "@/features/inventory/components/MedsTableClient";

import { mapInventoryItem } from "@/features/inventory/utils/map-inventory-item";

export default async function HomePage() {
  const [items, medicineForms, medicinePurposes, user] = await Promise.all([
    getMedicalItems(),
    getMedicineForms(),
    getMedicinePurposes(),
    getCurrentUser(),
  ]);

  console.log("items", items);

  const inventoryItems = items.map((item) =>
    mapInventoryItem({
      ...item,
      medicine_form: item.medicine_form[0] ?? null,
      medicine_purpose: item.medicine_purpose[0] ?? null,
    })
  );

  return (
    <>
      <div className="flex items-center justify-between">
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
