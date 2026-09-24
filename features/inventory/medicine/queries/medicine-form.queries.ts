import { createClient } from "@/lib/supabase/server";
import type { MedicineFormRow } from "@/features/inventory/types";

export async function getMedicineForms(): Promise<MedicineFormRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("medicine_forms")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load medicine forms: ${error.message}`);
  }

  return data ?? [];
}
