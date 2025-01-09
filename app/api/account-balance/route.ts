import { NextResponse } from 'next/server'

// This would typically fetch from a database
let balance = 5000

export async function GET() {
  return NextResponse.json({ balance })
}

