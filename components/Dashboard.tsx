'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ProgressBar } from "@/components/ProgressBar"
import { NotificationPanel } from "@/components/NotificationPanel"
import { DiscussionPanel } from "@/components/DiscussionPanel"
import { ProjectList } from "@/components/ProjectList"
import { WhatsAppButton } from "@/components/WhatsAppButton"

export function Dashboard({ userRole }: { userRole: 'user' | 'admin' }) {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push('/login')
      }
    }
    getUser()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">JayK Communications Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={user.user_metadata.avatar_url} />
            <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{user.email}</span>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Balance</CardTitle>
                <CardDescription>Amount owed for services</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$1,234.56</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Your current progress</CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressBar progress={75} />
              </CardContent>
            </Card>
            {userRole === 'admin' && (
              <Card>
                <CardHeader>
                  <CardTitle>Team Management</CardTitle>
                  <CardDescription>Assign tasks and manage team</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Manage Team</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="projects">
          <ProjectList userRole={userRole} />
        </TabsContent>
        <TabsContent value="discussions">
          <DiscussionPanel />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationPanel />
        </TabsContent>
      </Tabs>
      <Separator className="my-4" />
      <Card>
        <CardHeader>
          <CardTitle>Company Policies</CardTitle>
          <CardDescription>Important guidelines for all employees</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please review our company policies regularly to ensure compliance.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline">View Policies</Button>
        </CardFooter>
      </Card>
      <WhatsAppButton adminNumber="+1234567890" />
    </div>
  )
}

