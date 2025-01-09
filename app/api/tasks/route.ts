import { NextResponse } from 'next/server'

// This would typically fetch from a database
let tasks: { id: string; content: string; completed: boolean }[] = []

export async function GET() {
  return NextResponse.json({ tasks })
}

export async function POST(request: Request) {
  const { task } = await request.json()
  tasks.push({ id: Date.now().toString(), content: task, completed: false })
  return NextResponse.json({ success: true })
}

