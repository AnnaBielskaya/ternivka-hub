import { createClient } from "@/lib/supabase/server";

export async function getMedicalItems() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items_medicine")
    .select(`
      id,
      name,
      category_id,
      dosage,
      active_ingredient,
      volume,
      unit,
      refill_required,
      minimum_quantity,

      categories (
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