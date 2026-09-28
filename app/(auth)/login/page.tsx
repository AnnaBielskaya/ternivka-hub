"use client";

import { FormEvent, useState } from "react";

import CustomButton from "@/components/ui/CustomButton";
import PasswordInput from "@/components/ui/PasswordInput";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          phone,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.status === "error") {
        setError(result.message ?? "Не вдалося виконати вхід.");
        setLoading(false);
        return;
      }

      window.location.assign("/");
    } catch {
      setError("Не вдалося виконати вхід.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900">
            Тернівські склади
          </h1>

          <p className="mt-1 text-sm text-gray-500">Увійдіть до системи</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Телефон
              </label>

              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+380..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Пароль
              </label>

              <PasswordInput
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <CustomButton
              type="submit"
              disabled={loading}
              className="h-10 w-full rounded-lg bg-gray-800 px-4 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Вхід..." : "Увійти"}
            </CustomButton>
          </div>
        </form>
      </div>
    </main>
  );
}
