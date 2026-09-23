"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import CustomButton from "@/components/ui/CustomButton";
import StatusBadge from "@/components/ui/StatusBadge";

import type { AdminInvitation, AdminUser } from "../actions/get-users";

import { setUserActive } from "../actions/set-user-active";
import EditUserModal from "./EditUserModal";

type UsersTableClientProps = {
  users: AdminUser[];
  invitations: AdminInvitation[];
};

type UsersTab = "users" | "invitations";

const ROLE_LABELS = {
  editor: "Редагування",
  admin: "Адміністратор",
  super_admin: "Супер-адміністратор",
} as const;

const UsersTableClient = ({ users, invitations }: UsersTableClientProps) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<UsersTab>("users");

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

  const handleCopyInvitation = async (invitationId: string) => {
    const activationUrl = `${window.location.origin}/activate/${invitationId}`;

    await navigator.clipboard.writeText(activationUrl);
  };

  return (
    <>
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`cursor-pointer border-b-2 pb-3 text-sm font-medium transition ${
              activeTab === "users"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            Користувачі
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("invitations")}
            className={`cursor-pointer border-b-2 pb-3 text-sm font-medium transition ${
              activeTab === "invitations"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            Запрошені
          </button>
        </div>
      </div>

      {activeTab === "users" && (
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
      )}

      {activeTab === "invitations" && (
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

                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                  Дійсне до
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">
                  Посилання
                </th>
              </tr>
            </thead>

            <tbody>
              {invitations.length > 0 ? (
                invitations.map((invitation) => {
                  const isAccepted = Boolean(invitation.accepted_at);

                  const isExpired =
                    !isAccepted &&
                    new Date(invitation.expires_at) <= new Date();

                  return (
                    <tr
                      key={invitation.id}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {invitation.name || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600">
                          {invitation.phone || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600">
                          {ROLE_LABELS[invitation.role]}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          title={
                            isAccepted
                              ? "Прийнято"
                              : isExpired
                              ? "Протерміновано"
                              : "Очікує активації"
                          }
                          variant={
                            isAccepted
                              ? "success"
                              : isExpired
                              ? "warning"
                              : "info"
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(invitation.expires_at).toLocaleDateString(
                            "uk-UA"
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <CustomButton
                            variant="secondary"
                            onClick={() => handleCopyInvitation(invitation.id)}
                          >
                            Копіювати
                          </CustomButton>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-gray-400"
                  >
                    Запрошень поки немає
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

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
