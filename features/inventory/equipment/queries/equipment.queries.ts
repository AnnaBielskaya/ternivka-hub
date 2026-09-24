import { createClient } from "@/lib/supabase/server";

import type { EquipmentItem } from "../types";

export const getEquipmentItems = async (): Promise<EquipmentItem[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items_equipment")
    .select(
      `
      id,
      name,
      status,
      power_source,
      quantity,
      comment,
      created_by,
      created_at,
      updated_at,
      creator:profiles!items_equipment_created_by_fkey (
        name
      )
    `
    )
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as EquipmentItem[];
};
