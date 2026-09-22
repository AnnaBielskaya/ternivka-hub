"use client";

import { useState } from "react";

import Modal from "@/components/ui/Modal";
import CustomButton from "@/components/ui/CustomButton";

import { createUser } from "../actions/create-user";
import { UserRole } from "../types";

type CreateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  {
    value: "editor",
    label: "Редагування",
  },
  {
    value: "admin",
    label: "Адміністратор",
  },
];

const CreateUserModal = ({ isOpen, onClose }: CreateUserModalProps) => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("editor");
  const [activationUrl, setActivationUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setPhone("");
    setName("");
    setRole("editor");
    setActivationUrl("");
    setError("");
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setActivationUrl("");
    setIsSubmitting(true);

    const result = await createUser(phone, name, role);

    setIsSubmitting(false);

    if (result.status === "error") {
      setError(result.message);
      return;
    }

    if (result.invitationId) {
      setActivationUrl(
        `${window.location.origin}/activate/${result.invitationId}`
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Створити користувача"
      onClose={handleClose}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <CustomButton
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Скасувати
          </CustomButton>

          <CustomButton
            type="submit"
            form="create-user-form"
            disabled={isSubmitting || Boolean(activationUrl)}
          >
            {isSubmitting ? "Створення..." : "Створити"}
          </CustomButton>
        </div>
      }
    >
      <form id="create-user-form" onSubmit={handleSubmit}>
        <div className="space-y-5 p-6">
          <div>
            <label
              htmlFor="create-user-phone"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Телефон
              <span className="text-red-500"> *</span>
            </label>

            <input
              id="create-user-phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+380..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="create-user-name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Позивний
              <span className="text-red-500"> *</span>
            </label>

            <input
              id="create-user-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ім'я"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="create-user-role"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Роль
            </label>

            <select
              id="create-user-role"
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

          {activationUrl && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-800">
                Посилання для активації
              </p>

              <p className="mt-1 break-all text-xs text-gray-500">
                {activationUrl}
              </p>

              <CustomButton
                type="button"
                variant="secondary"
                className="mt-3"
                onClick={() => navigator.clipboard.writeText(activationUrl)}
              >
                Копіювати посилання
              </CustomButton>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default CreateUserModal;
