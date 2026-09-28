"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

type DeleteEquipmentResult =
  | {
      status: "success";
    }
  | {
      status: "error";
      message: string;
    };

export const deleteEquipment = async (
  id: string
): Promise<DeleteEquipmentResult> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("items_equipment")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete equipment:", error);

    return {
      status: "error",
      message: "Не вдалося видалити обладнання.",
    };
  }

  revalidatePath("/category/equipment");

  return {
    status: "success",
  };
};
