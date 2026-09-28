import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.json();

  const phone = String(body.phone ?? "").trim();
  const password = String(body.password ?? "");

  if (!phone || !password) {
    return NextResponse.json(
      {
        status: "error",
        message: "Введіть телефон і пароль.",
      },
      { status: 400 }
    );
  }

  const supabaseAdmin = createAdminClient();

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  if (profileError || !profile) {
    return NextResponse.json(
      {
        status: "error",
        message: "Невірний номер телефону або пароль.",
      },
      { status: 401 }
    );
  }

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.getUserById(profile.id);

  if (authError || !authData.user?.email) {
    return NextResponse.json(
      {
        status: "error",
        message: "Невірний номер телефону або пароль.",
      },
      { status: 401 }
    );
  }

  let response = NextResponse.json({
    status: "success",
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return (
            request.headers
              .get("cookie")
              ?.split(";")
              .filter(Boolean)
              .map((cookie) => {
                const separatorIndex = cookie.indexOf("=");

                return {
                  name: cookie.slice(0, separatorIndex).trim(),
                  value: decodeURIComponent(
                    cookie.slice(separatorIndex + 1).trim()
                  ),
                };
              }) ?? []
          );
        },

        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: authData.user.email,
    password,
  });

  if (signInError) {
    return NextResponse.json(
      {
        status: "error",
        message: "Невірний номер телефону або пароль.",
      },
      { status: 401 }
    );
  }

  return response;
}
