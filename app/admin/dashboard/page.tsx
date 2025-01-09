'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { supabase } from '@/lib/supabase'

type TeamMember = {
  id: string;
  name: string;
  email: string;
  balance: number;
}

export default function AdminDashboard() {
  const [message, setMessage] = useState('')
  const [notification, setNotification] = useState('')
  const [newTask, setNewTask] = useState('')
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '' })
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [selectedMember, setSelectedMember] = useState('')
  const [balanceChange, setBalanceChange] = useState('')

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, balance')

    if (error) {
      console.error('Error fetching team members:', error)
    } else {
      setTeamMembers(data || [])
    }
  }

  const sendMessage = async () => {
    if (message.trim()) {
      const { error } = await supabase
        .from('messages')
        .insert({ content: message, sender: 'Admin', timestamp: new Date().toISOString() })

      if (error) {
        console.error('Error sending message:', error)
      } else {
        setMessage('')
        alert('Message sent successfully')
      }
    }
  }

  const sendNotification = async () => {
    if (notification.trim()) {
      const { error } = await supabase
        .from('notifications')
        .insert({ content: notification, timestamp: new Date().toISOString() })

      if (error) {
        console.error('Error sending notification:', error)
      } else {
        setNotification('')
        alert('Notification sent successfully')
      }
    }
  }

  const assignTask = async () => {
    if (newTask.trim()) {
      const { error } = await supabase
        .from('tasks')
        .insert({ content: newTask, completed: false, dueDate: new Date().toISOString() })

      if (error) {
        console.error('Error assigning task:', error)
      } else {
        setNewTask('')
        alert('Task assigned successfully')
      }
    }
  }

  const addTeamMember = async () => {
    if (newMember.name && newMember.email && newMember.password) {
      const { error } = await supabase.auth.signUp({
        email: newMember.email,
        password: newMember.password,
      })

      if (error) {
        console.error('Error adding team member:', error)
        alert('Error adding team member')
      } else {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ name: newMember.name, email: newMember.email, balance: 0 })

        if (profileError) {
          console.error('Error creating profile:', profileError)
          alert('Error creating profile')
        } else {
          setNewMember({ name: '', email: '', password: '' })
          alert('Team member added successfully')
          fetchTeamMembers()
        }
      }
    }
  }

  const updateBalance = async () => {
    if (selectedMember && balanceChange) {
      const { error } = await supabase
        .from('profiles')
        .update({ balance: parseFloat(balanceChange) })
        .eq('id', selectedMember)

      if (error) {
        console.error('Error updating balance:', error)
        alert('Error updating balance')
      } else {
        setBalanceChange('')
        alert('Balance updated successfully')
        fetchTeamMembers()
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Admin Dashboard
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Send Message to Team</CardTitle>
              <CardDescription>This message will appear in the team members' workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="mb-4"
              />
              <Button onClick={sendMessage}>Send Message</Button>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Send Notification</CardTitle>
              <CardDescription>This will trigger a notification for all team members</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={notification}
                onChange={(e) => setNotification(e.target.value)}
                placeholder="Type your notification here..."
                className="mb-4"
              />
              <Button onClick={sendNotification}>Send Notification</Button>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Assign Task</CardTitle>
              <CardDescription>This task will be assigned to all team members</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Type new task here..."
                className="mb-4"
              />
              <Button onClick={assignTask}>Assign Task</Button>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Add Team Member</CardTitle>
              <CardDescription>Add a new member to the marketing team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newMember.password}
                    onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
                <Button onClick={addTeamMember}>Add Member</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Update Account Balance</CardTitle>
              <CardDescription>Adjust the account balance for a team member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="member">Select Member</Label>
                  <select
                    id="member"
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select a member</option>
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} (Current Balance: ${member.balance})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="balance">Amount to Add/Subtract</Label>
                  <Input
                    id="balance"
                    type="number"
                    value={balanceChange}
                    onChange={(e) => setBalanceChange(e.target.value)}
                    placeholder="Enter amount (use negative for subtraction)"
                  />
                </div>
                <Button onClick={updateBalance}>Update Balance</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

