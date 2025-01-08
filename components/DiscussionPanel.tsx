'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function DiscussionPanel() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching messages:', error)
      } else {
        setMessages(data)
      }
    }

    fetchMessages()

    const subscription = supabase
      .channel('messages')
      .on('INSERT', payload => {
        setMessages(prevMessages => [payload.new, ...prevMessages])
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase
        .from('messages')
        .insert({ user_id: user.id, content: newMessage })

      if (error) {
        console.error('Error sending message:', error)
      } else {
        setNewMessage('')
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discussion Panel</CardTitle>
        <CardDescription>Discuss projects and ask questions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-4">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            className="mb-2"
          />
          <Button type="submit">Send Message</Button>
        </form>
        <div className="space-y-4">
          {messages.map((message: any) => (
            <div key={message.id} className="p-4 bg-gray-100 rounded-lg">
              <p>{message.content}</p>
              <span className="text-sm text-gray-500">{new Date(message.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

