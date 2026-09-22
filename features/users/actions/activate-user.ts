"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type ActivateUserResult = {
  status: "success" | "error";
  message: string;
};

export async function activateUser(
  invitationId: string,
  password: string
): Promise<ActivateUserResult> {
  const supabaseAdmin = createAdminClient();

  if (!invitationId) {
    return {
      status: "error",
      message: "Некоректне посилання.",
    };
  }

  if (password.length < 6) {
    return {
      status: "error",
      message: "Пароль має містити щонайменше 6 символів.",
    };
  }

  const { data: invitation, error: invitationError } = await supabaseAdmin
    .from("invitations")
    .select("id, phone, name, role, expires_at, accepted_at, revoked_at")
    .eq("id", invitationId)
    .maybeSingle();

  if (invitationError || !invitation) {
    return {
      status: "error",
      message: "Посилання недійсне або не існує.",
    };
  }

  if (invitation.accepted_at) {
    return {
      status: "error",
      message: "Це посилання вже використано.",
    };
  }

  if (invitation.revoked_at) {
    return {
      status: "error",
      message: "Це посилання відкликано.",
    };
  }

  if (new Date(invitation.expires_at) <= new Date()) {
    return {
      status: "error",
      message: "Термін дії посилання закінчився.",
    };
  }

  if (!invitation.phone || !invitation.name) {
    return {
      status: "error",
      message: "Дані запрошення неповні.",
    };
  }

  const technicalEmail = `${invitation.id}@internal.local`;

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: technicalEmail,
      password,
      email_confirm: true,
      user_metadata: {
        name: invitation.name,
      },
    });

  if (authError || !authData.user) {
    console.error("AUTH ERROR:", authError);

    return {
      status: "error",
      message: authError?.message || "Не вдалося створити акаунт.",
    };
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: authData.user.id,
    name: invitation.name,
    phone: invitation.phone,
    role: invitation.role,
  });

  if (profileError) {
    console.error("PROFILE ERROR:", profileError);

    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

    return {
      status: "error",
      message: profileError.message || "Не вдалося створити профіль.",
    };
  }

  const acceptedAt = new Date().toISOString();

  const { data: acceptedInvitation, error: acceptError } = await supabaseAdmin
    .from("invitations")
    .update({
      accepted_at: acceptedAt,
    })
    .eq("id", invitationId)
    .is("accepted_at", null)
    .is("revoked_at", null)
    .gt("expires_at", acceptedAt)
    .select("id")
    .maybeSingle();

  if (acceptError || !acceptedInvitation) {
    console.error("INVITATION ERROR:", acceptError);

    await supabaseAdmin.from("profiles").delete().eq("id", authData.user.id);

    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

    return {
      status: "error",
      message:
        acceptError?.message ||
        "Посилання вже використано або втратило чинність.",
    };
  }

  return {
    status: "success",
    message: "Акаунт успішно активовано.",
  };
}
