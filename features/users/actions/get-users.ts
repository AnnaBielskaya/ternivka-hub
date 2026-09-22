"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import { UserRole } from "../types";

const ALLOWED_ROLES = ["admin", "super_admin"] as const;

export type AdminUser = {
  id: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  last_sign_in_at: string | null;
  is_active: boolean;
};

export type AdminInvitation = {
  id: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  expires_at: string;
};

export type AdminUsersData = {
  users: AdminUser[];
  invitations: AdminInvitation[];
};

export async function getUsers(): Promise<AdminUsersData> {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      users: [],
      invitations: [],
    };
  }

  const { data: currentProfile, error: currentProfileError } =
    await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

  if (
    currentProfileError ||
    !currentProfile ||
    !ALLOWED_ROLES.includes(
      currentProfile.role as (typeof ALLOWED_ROLES)[number]
    )
  ) {
    return {
      users: [],
      invitations: [],
    };
  }

  const [
    { data: authData, error: authError },
    { data: profiles, error: profilesError },
    { data: invitations, error: invitationsError },
  ] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    }),

    supabaseAdmin.from("profiles").select("id, name, phone, role"),

    supabaseAdmin
      .from("invitations")
      .select("id, name, phone, role, created_at, expires_at")
      .is("accepted_at", null)
      .is("revoked_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", {
        ascending: false,
      }),
  ]);

  if (authError || profilesError || invitationsError) {
    return {
      users: [],
      invitations: [],
    };
  }

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile])
  );

  const users = authData.users
    .map((authUser) => {
      const profile = profileMap.get(authUser.id);

      if (!profile) {
        return null;
      }

      return {
        id: authUser.id,
        name: profile.name ?? null,
        phone: profile.phone ?? null,
        role: profile.role as UserRole,
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at ?? null,
        is_active:
          !authUser.banned_until ||
          new Date(authUser.banned_until) <= new Date(),
      };
    })
    .filter((user): user is AdminUser => user !== null);

  return {
    users,
    invitations: (invitations ?? []) as AdminInvitation[],
  };
}
