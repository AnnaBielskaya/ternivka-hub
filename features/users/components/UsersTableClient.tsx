"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import CustomButton from "@/components/ui/CustomButton";
import StatusBadge from "@/components/ui/StatusBadge";

import type { AdminUser } from "../actions/get-users";
import { setUserActive } from "../actions/set-user-active";
import EditUserModal from "./EditUserModal";

type UsersTableClientProps = {
  users: AdminUser[];
};

const ROLE_LABELS = {
  editor: "Редагування",
  admin: "Адміністратор",
  super_admin: "Супер-адміністратор",
} as const;

const UsersTableClient = ({ users }: UsersTableClientProps) => {
  const router = useRouter();

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleToggleActive = (user: AdminUser) => {
    const action = user.is_active ? "деактивувати" : "активувати";

    if (
      !window.confirm(
        `Ви дійсно хочете ${action} користувача ${user.name ?? ""}?`
      )
    ) {
      return;
    }

    setPendingUserId(user.id);

    startTransition(async () => {
      const result = await setUserActive(user.id, !user.is_active);

      setPendingUserId(null);

      if (result.status === "error") {
        window.alert(result.message);
        return;
      }

      router.refresh();
    });
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                Позивний
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                Телефон
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                Роль
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                Статус
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">
                Дії
              </th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => {
                const isUpdating = isPending && pendingUserId === user.id;

                return (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {user.name || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">
                        {user.phone || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        title={user.is_active ? "Активний" : "Деактивований"}
                        variant={user.is_active ? "success" : "warning"}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <CustomButton
                          variant="secondary"
                          onClick={() => setEditingUser(user)}
                          disabled={isUpdating}
                        >
                          Редагувати
                        </CustomButton>

                        <CustomButton
                          variant={
                            user.is_active ? "dangerOutline" : "secondary"
                          }
                          onClick={() => handleToggleActive(user)}
                          disabled={isUpdating}
                        >
                          {isUpdating
                            ? "..."
                            : user.is_active
                            ? "Деактивувати"
                            : "Активувати"}
                        </CustomButton>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-sm text-gray-400"
                >
                  Користувачів поки немає
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={() => {
            setEditingUser(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
};

export default UsersTableClient;
