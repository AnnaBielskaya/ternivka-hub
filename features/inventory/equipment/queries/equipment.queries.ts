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

  return (data ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    status: item.status,
    power_source: item.power_source,
    quantity: item.quantity,
    comment: item.comment,
    created_by: item.created_by,
    created_at: item.created_at,
    updated_at: item.updated_at,
    creator: item.creator?.name ?? null,
  }));
};
