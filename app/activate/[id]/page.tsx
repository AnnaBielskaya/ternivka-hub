"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import CustomButton from "@/components/ui/CustomButton";
import { activateUser } from "@/features/users/actions/activate-user";

const ActivatePage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (password !== passwordConfirmation) {
      setError("Паролі не збігаються.");
      return;
    }

    setIsSubmitting(true);

    const result = await activateUser(params.id, password);

    setIsSubmitting(false);

    if (result.status === "error") {
      setError(result.message);
      return;
    }

    router.push("/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900">
            Активація акаунта
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Створіть пароль для входу в систему.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Пароль
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="password-confirmation"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Повторіть пароль
              </label>

              <input
                id="password-confirmation"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <CustomButton
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full"
            >
              {isSubmitting ? "Активація..." : "Активувати акаунт"}
            </CustomButton>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ActivatePage;
