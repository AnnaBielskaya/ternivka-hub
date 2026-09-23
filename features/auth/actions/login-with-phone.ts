"use server";

import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type LoginWithPhoneResult = {
  status: "success" | "error";
  message: string;
};

export async function loginWithPhone(
  phone: string,
  password: string
): Promise<LoginWithPhoneResult> {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const normalizedPhone = phone.trim();

  if (!normalizedPhone || !password) {
    return {
      status: "error",
      message: "Введіть телефон і пароль.",
    };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("phone", normalizedPhone)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      status: "error",
      message: "Невірний номер телефону або пароль.",
    };
  }

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.getUserById(profile.id);

  if (authError || !authData.user?.email) {
    return {
      status: "error",
      message: "Невірний номер телефону або пароль.",
    };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: authData.user.email,
    password,
  });

  if (signInError) {
    return {
      status: "error",
      message: "Невірний номер телефону або пароль.",
    };
  }

  redirect("/");
}
