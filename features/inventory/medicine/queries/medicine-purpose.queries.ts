import { createClient } from "@/lib/supabase/server";
import type { MedicinePurposeRow } from "@/features/inventory/types";

export async function getMedicinePurposes(): Promise<
  MedicinePurposeRow[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("medicine_purposes")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(
      `Failed to load medicine purposes: ${error.message}`,
    );
  }

  return data ?? [];
}