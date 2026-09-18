import { createClient } from "@/lib/supabase/server";

export async function getMedicalItems() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items_medicine")
    .select(`
      id,
      name,
      dosage,
      active_ingredient,
      volume,
      unit,
      refill_required,
      minimum_quantity,

      medicine_form:medicine_forms (
        id,
        name
      ),

      medicine_purpose:medicine_purposes (
        id,
        name
      ),

      stock (
        id,
        expiry_month,
        expiry_year,
        quantity
      )
    `)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(
      `Failed to load medical inventory: ${error.message}`,
    );
  }

  return data ?? [];
}