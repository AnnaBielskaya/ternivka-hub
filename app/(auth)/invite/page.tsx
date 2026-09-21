import { redirect } from "next/navigation";

import CustomButton from "@/components/ui/CustomButton";
import { createClient } from "@/lib/supabase/server";

const InvitePage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        action="/api/auth/complete-invite"
        method="post"
        className="w-full max-w-sm space-y-5"
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Завершення реєстрації
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Створіть пароль для вашого облікового запису.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Новий пароль
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        <CustomButton type="submit" className="h-10 w-full px-4 text-sm">
          Створити пароль
        </CustomButton>
      </form>
    </main>
  );
};

export default InvitePage;
