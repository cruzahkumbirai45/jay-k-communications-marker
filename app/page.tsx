import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return redirect('/login')
    }
    
    return redirect('/dashboard')
  } catch (error) {
    console.error('Error checking auth session:', error)
    return redirect('/login')
  }
}

