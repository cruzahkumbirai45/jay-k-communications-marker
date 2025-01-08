'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Dashboard } from '@/components/Dashboard'

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

          if (error) {
            console.error('Error fetching user role:', error)
            setUserRole('user') // Default to 'user' if role fetch fails
          } else {
            setUserRole(data.role as 'user' | 'admin')
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Error getting user:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    getUserRole()
  }, [router, supabase])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!userRole) {
    return null
  }

  return <Dashboard userRole={userRole} />
}

