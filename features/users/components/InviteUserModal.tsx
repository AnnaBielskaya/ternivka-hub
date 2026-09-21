"use client";

import { useState } from "react";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";

import { inviteUser } from "../actions/invite-user";
import { UserRole } from "../types";

type InviteUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ROLE_OPTIONS: {
  value: UserRole;
  label: string;
}[] = [
  {
    value: "viewer",
    label: "Перегляд",
  },
  {
    value: "editor",
    label: "Редагування",
  },
  {
    value: "admin",
    label: "Адміністратор",
  },
];

const InviteUserModal = ({ isOpen, onClose }: InviteUserModalProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("viewer");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleClose = () => {
    if (isLoading) {
      return;
    }

    setEmail("");
    setRole("viewer");
    setError("");
    setSuccess("");
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    const result = await inviteUser(email, role);

    setIsLoading(false);

    if (result.status === "error") {
      setError(result.message);
      return;
    }

    setSuccess("Запрошення надіслано на вказаний email.");

    setTimeout(() => {
      handleClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Запросити користувача"
      onClose={handleClose}
      footer={
        <div className="flex justify-end gap-3">
          <CustomButton
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Скасувати
          </CustomButton>

          <CustomButton
            type="submit"
            form="invite-user-form"
            disabled={isLoading}
          >
            {isLoading ? "Надсилання..." : "Запросити"}
          </CustomButton>
        </div>
      }
    >
      <form id="invite-user-form" onSubmit={handleSubmit}>
        <div className="space-y-5 p-6">
          <div>
            <label
              htmlFor="invite-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="invite-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@email.com"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="invite-role"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Роль
            </label>

            <select
              id="invite-role"
              name="role"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              className="h-10 w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {success && <p className="text-sm text-green-600">{success}</p>}
        </div>
      </form>
    </Modal>
  );
};

export default InviteUserModal;
