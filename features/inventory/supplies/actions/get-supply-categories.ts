"use server";

import { createClient } from "@/lib/supabase/server";

import type { SupplyCategory } from "../types";

export const getSupplyCategories = async (): Promise<SupplyCategory[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("supplies_categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch supply categories:", error);
    return [];
  }

  console.log("Fetched supply categories:", data);

  return data ?? [];
};
