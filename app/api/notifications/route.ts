import { NextResponse } from 'next/server'

// This would typically fetch from a database
let notifications: string[] = []

export async function GET() {
  return NextResponse.json({ notifications })
}

export async function POST(request: Request) {
  const { notification } = await request.json()
  notifications.push(notification)
  return NextResponse.json({ success: true })
}

