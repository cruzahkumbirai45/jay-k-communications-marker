import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error('Error exchanging code for session:', error)
      // Redirect to an error page if something goes wrong
      return NextResponse.redirect(`${requestUrl.origin}/auth-error`)
    }
  }

  // Redirect to the dashboard after successful authentication
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}

