"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

type DeleteSupplyState = {
  status: "success" | "error";
  message: string;
};

export const deleteSupply = async (
  supplyId: string
): Promise<DeleteSupplyState> => {
  const supabase = await createClient();

  if (!supplyId) {
    return {
      status: "error",
      message: "Не вказано розхідник для видалення.",
    };
  }

  const { error } = await supabase
    .from("items_supplies")
    .delete()
    .eq("id", supplyId);

  if (error) {
    console.error("Failed to delete supply:", error);

    return {
      status: "error",
      message: `Не вдалося видалити розхідник: ${error.message}`,
    };
  }

  revalidatePath("/category/supplies");

  return {
    status: "success",
    message: "Розхідник успішно видалено.",
  };
};
