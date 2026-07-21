'use client'

import { createClient } from '@/lib/supabase/client'

export default function TestPage() {
  async function testSignup() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email: `test${Date.now()}@gmail.com`,
      password: 'Test@12345',
    })

    console.log(data)
    console.log(error)
    alert(JSON.stringify({ data, error }))
  }

  return <button onClick={testSignup}>Test Signup</button>
}