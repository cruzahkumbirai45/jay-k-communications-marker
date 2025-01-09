'use client'

import { useState, useEffect } from 'react'
import { Bell, CheckCircle, Clock, MessageSquare, Phone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Dashboard() {
  const [accountBalance, setAccountBalance] = useState(0)
  const [notifications, setNotifications] = useState<string[]>([])
  const [pendingTasks, setPendingTasks] = useState<{ id: string; title: string }[]>([])
  const [completedTasks, setCompletedTasks] = useState<{ id: string; title: string }[]>([])
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [balanceRes, notificationsRes, tasksRes, messagesRes] = await Promise.all([
      fetch('/api/account-balance'),
      fetch('/api/notifications'),
      fetch('/api/tasks'),
      fetch('/api/messages')
    ])

    const balanceData = await balanceRes.json()
    const notificationsData = await notificationsRes.json()
    const tasksData = await tasksRes.json()
    const messagesData = await messagesRes.json()

    setAccountBalance(balanceData.balance)
    setNotifications(notificationsData.notifications)
    setPendingTasks(tasksData.tasks.filter((task: any) => !task.completed))
    setCompletedTasks(tasksData.tasks.filter((task: any) => task.completed))
    setMessages(messagesData.messages.map((m: any) => m.content))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, Cruzah!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${accountBalance.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {notifications.map((notification, index) => (
                <li key={index} className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>{notification}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {pendingTasks.map(task => (
                <li key={task.id} className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{task.title}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {completedTasks.map(task => (
                <li key={task.id} className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>{task.title}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages from Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {messages.map((message, index) => (
                <li key={index} className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>{message}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              Contact Admin
            </Button>
            <Button className="w-full bg-green-500 hover:bg-green-600">
              <Phone className="mr-2 h-4 w-4" /> WhatsApp
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Link href="/workspace">
          <Button className="w-full">Go to Workspace</Button>
        </Link>
      </div>
    </div>
  )
}

