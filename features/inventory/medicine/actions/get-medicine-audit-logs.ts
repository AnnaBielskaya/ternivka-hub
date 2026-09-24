"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type MedicineAuditLog = {
  id: string;
  user_id: string | null;
  user_name: string | null;
  action: "INSERT" | "UPDATE" | "DELETE";
  entity_type: "items_medicine" | "stock";
  entity_id: string;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  created_at: string;
};

export async function getMedicineAuditLogs(
  itemId: string
): Promise<MedicineAuditLog[]> {
  if (!itemId) {
    return [];
  }

  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const [
    { data: medicineLogs, error: medicineLogsError },
    { data: stockLogs, error: stockLogsError },
  ] = await Promise.all([
    supabaseAdmin
      .from("audit_logs")
      .select(
        "id, user_id, action, entity_type, entity_id, old_data, new_data, created_at"
      )
      .eq("entity_type", "items_medicine")
      .eq("entity_id", itemId),

    supabaseAdmin
      .from("audit_logs")
      .select(
        "id, user_id, action, entity_type, entity_id, old_data, new_data, created_at"
      )
      .eq("entity_type", "stock")
      .or(`new_data->>item_id.eq.${itemId},old_data->>item_id.eq.${itemId}`),
  ]);

  if (medicineLogsError || stockLogsError) {
    return [];
  }

  const logs = [
    ...((medicineLogs ?? []) as MedicineAuditLog[]),
    ...((stockLogs ?? []) as MedicineAuditLog[]),
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const userIds = [
    ...new Set(
      logs
        .map((log) => log.user_id)
        .filter((userId): userId is string => Boolean(userId))
    ),
  ];

  const userNames = new Map<string, string>();

  await Promise.all(
    userIds.map(async (userId) => {
      const { data } = await supabaseAdmin.auth.admin.getUserById(userId);

      if (!data.user) {
        return;
      }

      const fullName =
        data.user.user_metadata?.full_name ??
        data.user.user_metadata?.name ??
        data.user.email ??
        null;

      if (fullName) {
        userNames.set(userId, String(fullName));
      }
    })
  );

  return logs.map((log) => ({
    ...log,
    user_name: log.user_id ? userNames.get(log.user_id) ?? null : null,
  }));
}
