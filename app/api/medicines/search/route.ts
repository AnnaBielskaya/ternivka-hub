import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 },
    );
  }

  const query =
    request.nextUrl.searchParams
      .get("q")
      ?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  const { data, error } =
    await supabase
      .from("items_medicine")
      .select(`
        id,
        name,
        dosage,
        volume,
        medicine_form:medicine_forms (
          id,
          name
        )
      `)
      .ilike("name", `%${query}%`)
      .order("name", {
        ascending: true,
      })
      .limit(10);

  if (error) {
    console.error(
      "Failed to search medicines:",
      error,
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося виконати пошук.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    data ?? [],
  );
}