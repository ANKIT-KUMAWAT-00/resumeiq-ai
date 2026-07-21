import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// GET: Fetch all resume reviews for the authenticated user
export async function GET(request: Request) {
  try {
    // In Next.js 15, cookies() must be awaited
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get the currently logged-in user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all reviews for this specific user, ordered by newest first
    // We only select the summary data to keep the payload light for the dashboard list
    const { data, error } = await supabase
      .from("reviews")
      .select("id, created_at, overall_score, job_title, company_name, target_role")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching reviews list:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch reviews list" },
      { status: 500 }
    );
  }
}