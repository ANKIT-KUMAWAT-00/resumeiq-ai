'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, signupSchema, LoginFormValues, SignupFormValues } from '@/lib/validations/auth'

export async function login(data: LoginFormValues) {
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Invalid form data" }
  }

  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })
  console.log("LLogin input:", parsed.data)
  console.log("AUTH DATA:", authData)
  console.log("AUTH ERROR:", error)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

// export async function signup(data: SignupFormValues) {
//   const parsed = signupSchema.safeParse(data)
//   if (!parsed.success) {
//     return { error: 'Invalid form data' }
//   }

//   const supabase = await createClient()
//   const { error } = await supabase.auth.signUp({
//     email: parsed.data.email,
//     password: parsed.data.password,
//     options: {
//       data: {
//         full_name: parsed.data.fullName,
//       },
      
//       // Ensure you configure this URL in your Supabase Auth settings
//       emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
//     },
//   })
  

//   if (error) {
//     return { error: error.message }
//   }

//   return { success: 'Check your email to verify your account.' }
// }
export async function signup(data: SignupFormValues) {
  const parsed = signupSchema.safeParse(data);

  if (!parsed.success) {
    console.log("Validation failed:", parsed.error);
    return { error: "Validation failed" };
  }

  const supabase = await createClient();

 const { data: authData, error } = await supabase.auth.signUp({
  email: parsed.data.email,
  password: parsed.data.password,
});

  console.log("========== SIGNUP ==========");
console.log("AUTH DATA:", authData);
console.log("AUTH ERROR:", error);
console.log("============================");

  if (error) {
    return { error: error.message };
  }

  return {
    success: "Account created successfully",
  };
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}