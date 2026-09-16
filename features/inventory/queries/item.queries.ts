import { createClient } from "@/lib/supabase/server";

export async function getMedicalItems() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items_medicine")
    .select(`
      id,
      name,
      dosage,
      volume,
      unit,
      minimum_quantity,
      category_id,
      stock (
        id,
        expiry_month,
        expiry_year,
        quantity
      ),
      categories (
        id,
        name
      )
    `);

  if (error) {
    throw new Error(
      `Failed to load inventory: ${error.message}`,
    );
  }

  return data;
}