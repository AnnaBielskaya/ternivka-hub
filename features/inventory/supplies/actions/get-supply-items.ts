import { createClient } from "@/lib/supabase/server";

import type { SupplyItem } from "../types";

export const getSupplyItems = async (): Promise<SupplyItem[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items_supplies")
    .select(
      `
      id,
      name,
      quantity,
      unit,
      minimum_quantity,
      comment,
      created_by,
      created_at,
      updated_at,
      category:supplies_categories (
        id,
        name,
        slug
      ),
      creator:profiles!items_supplies_created_by_fkey (
        id,
        name
      )
    `
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch supplies:", error);
    return [];
  }

  return (data ?? []) as SupplyItem[];
};
