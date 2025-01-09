import { NextResponse } from 'next/server'

// This would typically fetch from a database
let messages: { id: string; content: string; comments: string[] }[] = []

export async function GET() {
  return NextResponse.json({ messages })
}

export async function POST(request: Request) {
  const { message } = await request.json()
  messages.push({ id: Date.now().toString(), content: message, comments: [] })
  return NextResponse.json({ success: true })
}

