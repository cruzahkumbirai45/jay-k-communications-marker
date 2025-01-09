import { NextResponse } from 'next/server'

// This would typically update a database
export async function POST(request: Request) {
  const { memberId, amount } = await request.json()
  console.log(`Updated balance for member ${memberId} by ${amount}`)
  return NextResponse.json({ success: true })
}

