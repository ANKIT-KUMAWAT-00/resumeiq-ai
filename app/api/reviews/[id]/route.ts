import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// GET: Fetch a specific resume review by its ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // In Next.js 15, params must be awaited
    const { id } = await params; 
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

    // Fetch the review from the database
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id) // Security: Ensure the review belongs to the user
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching review:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch review data" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a specific resume review
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the record
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // Security check

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting review:", error.message);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}