import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  
  // The secure code sent by Supabase in the email link
  const code = searchParams.get("code");
  
  // Where to send them after successful login (defaults to dashboard)
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    
    // Initialize the Supabase server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    // Exchange the code for a verified user session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Success! Send them to the dashboard.
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If the code is missing or expired, redirect them back to login with an error flag
  return NextResponse.redirect(`${origin}/login?error=Invalid+or+expired+verification+link`);
}