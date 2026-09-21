"use client";

import { useState } from "react";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";
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

  const handleClose = () => {
    setEmail("");
    setRole("viewer");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Запросити користувача"
      size="sm"
      onClose={handleClose}
      footer={
        <div className="flex justify-end gap-3">
          <CustomButton variant="secondary" onClick={handleClose}>
            Скасувати
          </CustomButton>

          <CustomButton type="submit" form="invite-user-form">
            Запросити
          </CustomButton>
        </div>
      }
    >
      <form id="invite-user-form">
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
        </div>
      </form>
    </Modal>
  );
};

export default InviteUserModal;
