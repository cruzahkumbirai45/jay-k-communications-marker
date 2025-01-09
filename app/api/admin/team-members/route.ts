import { NextResponse } from 'next/server'

// This would typically fetch from a database
let teamMembers: { id: string; name: string; email: string; balance: number }[] = [
  { id: '1', name: 'Cruzah Kumbirai', email: 'cruzahkumbirai@gmail.com', balance: 5000 }
]

export async function GET() {
  return NextResponse.json({ teamMembers })
}

export async function POST(request: Request) {
  const { name, email } = await request.json()
  const newMember = { id: Date.now().toString(), name, email, balance: 0 }
  teamMembers.push(newMember)
  return NextResponse.json({ success: true, member: newMember })
}

