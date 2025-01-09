import { NextResponse } from 'next/server'

// This would typically interact with a database
let messages: string[] = []

export async function POST(request: Request) {
  const { message } = await request.json()
  messages.push(message)
  return NextResponse.json({ success: true })
}

export async function GET() {
  return NextResponse.json({ messages })
}

