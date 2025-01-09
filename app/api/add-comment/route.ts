import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { messageId, comment } = await request.json()
  // This would typically update a database
  // For now, we'll just console.log the comment
  console.log(`New comment on message ${messageId}: ${comment}`)
  return NextResponse.json({ success: true })
}

