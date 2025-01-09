import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { taskId } = await request.json()
  // This would typically update a database
  // For now, we'll just console.log the task toggle
  console.log(`Toggled completion status of task ${taskId}`)
  return NextResponse.json({ success: true })
}

