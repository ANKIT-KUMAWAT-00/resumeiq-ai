import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    // Next.js 15 requires awaiting cookies()
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

    // 1. Authenticate the User
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Calculate Usage (Count how many reviews they have generated)
    // If you add Stripe later, you would also check a 'profiles' table here for Pro status
    const { count, error: countError } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) throw countError;

    // 3. Define the Free Tier Limits
    const FREE_LIMIT = 10;
    const used = count || 0;
    const remaining = Math.max(0, FREE_LIMIT - used);
    
    // Placeholder for Stripe integration (Module 9)
    const isPro = false; 

    // 4. Return the usage stats to the frontend
    return NextResponse.json({
      used,
      remaining,
      limit: FREE_LIMIT,
      isPro,
    });

  } catch (error: any) {
    console.error("Error fetching usage limit:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}