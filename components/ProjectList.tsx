'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProjectList({ userRole }: { userRole: 'user' | 'admin' }) {
  const [projects, setProjects] = useState([])
  const [newProject, setNewProject] = useState({ title: '', description: '' })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching projects:', error)
      } else {
        setProjects(data)
      }
    }

    fetchProjects()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from('projects')
      .insert(newProject)

    if (error) {
      console.error('Error creating project:', error)
    } else {
      setNewProject({ title: '', description: '' })
      setIsDialogOpen(false)
      // Refetch projects
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      setProjects(data || [])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>View and manage projects</CardDescription>
      </CardHeader>
      <CardContent>
        {userRole === 'admin' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4">Create New Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Add a new project to the system</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title"
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Input 
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    />
                  </div>
                </div>
                <Button type="submit" className="mt-4">Create Project</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
        <div className="space-y-4">
          {projects.map((project: any) => (
            <div key={project.id} className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold">{project.title}</h3>
              <p>{project.description}</p>
              <span className="text-sm text-gray-500">{new Date(project.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

