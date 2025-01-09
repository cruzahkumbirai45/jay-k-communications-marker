import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const { name, email, password } = await request.json()

  const { data: user, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 })
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: user.user?.id, name, email, balance: 0 })

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, user: user.user })
}

export async function GET() {
  const { data: teamMembers, error } = await supabase
    .from('profiles')
    .select('id, name, email, balance')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ teamMembers })
}

