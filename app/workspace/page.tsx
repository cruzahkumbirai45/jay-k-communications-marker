'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Calendar, MessageSquare, CheckCircle, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  replies: {
    id: string;
    content: string;
    sender: string;
    timestamp: string;
  }[];
}

type Task = {
  id: string;
  content: string;
  completed: boolean;
  dueDate: string;
}

export default function Workspace() {
  const [messages, setMessages] = useState<Message[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [newReply, setNewReply] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [newTask, setNewTask] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('')

  useEffect(() => {
    fetchMessages()
    fetchTasks()

    const messagesSubscription = supabase
      .channel('messages')
      .on('INSERT', { event: 'messages' }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new as Message])
      })
      .subscribe()

    const tasksSubscription = supabase
      .channel('tasks')
      .on('INSERT', { event: 'tasks' }, (payload) => {
        setTasks((prevTasks) => [...prevTasks, payload.new as Task])
      })
      .on('UPDATE', { event: 'tasks' }, (payload) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === payload.new.id ? payload.new : task))
        )
      })
      .subscribe()

    return () => {
      messagesSubscription.unsubscribe()
      tasksSubscription.unsubscribe()
    }
  }, [])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching messages:', error)
    } else {
      setMessages(data || [])
    }
  }

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('dueDate', { ascending: true })

    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      setTasks(data || [])
    }
  }

  const addReply = async (messageId: string) => {
    if (newReply.trim()) {
      const { data, error } = await supabase
        .from('replies')
        .insert({
          message_id: messageId,
          content: newReply,
          sender: 'You', // Replace with actual user name
          timestamp: new Date().toISOString(),
        })

      if (error) {
        console.error('Error adding reply:', error)
      } else {
        setNewReply('')
        setReplyingTo(null)
        fetchMessages() // Refetch messages to include the new reply
      }
    }
  }

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', taskId)

    if (error) {
      console.error('Error updating task:', error)
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      )
    }
  }

  const addTask = async () => {
    if (newTask.trim() && taskDueDate) {
      const { error } = await supabase
        .from('tasks')
        .insert({
          content: newTask,
          completed: false,
          dueDate: taskDueDate,
        })

      if (error) {
        console.error('Error adding task:', error)
      } else {
        setNewTask('')
        setTaskDueDate('')
      }
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Workspace
      </motion.h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-100 p-4 rounded-lg space-y-2 mb-4"
              >
                <div className="flex items-start space-x-2">
                  <Avatar>
                    <AvatarFallback>{message.sender[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{message.sender}</p>
                    <p>{message.content}</p>
                    <p className="text-sm text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                {message.replies && message.replies.map((reply) => (
                  <motion.div
                    key={reply.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-8 bg-white p-2 rounded-lg flex items-start space-x-2"
                  >
                    <Avatar>
                      <AvatarFallback>{reply.sender[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{reply.sender}</p>
                      <p>{reply.content}</p>
                      <p className="text-sm text-gray-500">{new Date(reply.timestamp).toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))}
                {replyingTo === message.id ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-8 mt-2 space-y-2"
                  >
                    <Textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full"
                    />
                    <div className="flex space-x-2">
                      <Button onClick={() => addReply(message.id)} size="sm">Send Reply</Button>
                      <Button onClick={() => setReplyingTo(null)} variant="outline" size="sm">Cancel</Button>
                    </div>
                  </motion.div>
                ) : (
                  <Button onClick={() => setReplyingTo(message.id)} variant="outline" size="sm" className="ml-8 mt-2">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center space-x-2 mb-2"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id, task.completed)}
                  className="w-4 h-4"
                />
                <span className={task.completed ? 'line-through text-gray-500' : ''}>
                  {task.content}
                </span>
                <span className="text-sm text-gray-500">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {task.dueDate}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-2"
          >
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="New task..."
            />
            <Input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
            <Button onClick={addTask}>Add Task</Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}

