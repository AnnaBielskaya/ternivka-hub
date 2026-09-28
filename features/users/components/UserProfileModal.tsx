"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";

import { updateUser } from "../actions/update-user";
import type { UserRole } from "../types";

type UserProfileModalProps = {
  isOpen: boolean;
  userId: string;
  name: string;
  role: UserRole;
  onClose: () => void;
};

const UserProfileModal = ({
  isOpen,
  userId,
  name,
  role,
  onClose,
}: UserProfileModalProps) => {
  const router = useRouter();

  const [userName, setUserName] = useState(name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [isPending, startTransition] = useTransition();

  const resetForm = () => {
    setUserName(name);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleClose = () => {
    if (isPending) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const hasPasswordInput = Boolean(
      currentPassword || newPassword || confirmPassword
    );

    if (hasPasswordInput) {
      if (newPassword !== confirmPassword) {
        setError("Новий пароль і підтвердження не збігаються.");
        return;
      }

      if (!currentPassword || !newPassword) {
        setError("Для зміни пароля заповніть поточний і новий пароль.");
        return;
      }
    }

    startTransition(async () => {
      const result = await updateUser(
        userId,
        userName,
        "",
        role,
        currentPassword,
        newPassword
      );

      if (result.status === "error") {
        setError(result.message);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");

      onClose();
      router.refresh();
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Мій профіль"
      onClose={handleClose}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <CustomButton
            variant="secondary"
            onClick={handleClose}
            disabled={isPending}
          >
            Скасувати
          </CustomButton>

          <CustomButton
            type="submit"
            form="user-profile-form"
            disabled={isPending}
          >
            {isPending ? "Збереження..." : "Зберегти"}
          </CustomButton>
        </div>
      }
    >
      <form id="user-profile-form" onSubmit={handleSubmit}>
        <div className="space-y-5 p-4 sm:p-6">
          <div>
            <label
              htmlFor="profile-name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Позивний
            </label>

            <input
              id="profile-name"
              type="text"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              required
              disabled={isPending}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
            />
          </div>

          <div className="border-t border-gray-100" />

          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Зміна пароля
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Заповни ці поля тільки якщо хочеш змінити пароль.
            </p>
          </div>

          <div>
            <label
              htmlFor="current-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Поточний пароль
            </label>

            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              disabled={isPending}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Новий пароль
            </label>

            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              disabled={isPending}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Повторити новий пароль
            </label>

            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={isPending}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </form>
    </Modal>
  );
};

export default UserProfileModal;
