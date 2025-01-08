'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function NotificationPanel() {
  const [notifications, setNotifications] = useState([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching notifications:', error)
        } else {
          setNotifications(data)
        }
      }
    }

    fetchNotifications()
  }, [supabase])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Your latest updates and assignments</CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.map((notification: any) => (
          <div key={notification.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold">{notification.title}</h3>
            <p>{notification.message}</p>
            <span className="text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

