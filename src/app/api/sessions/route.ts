// TODO: erase this file
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  // Add session creation logic here
  return NextResponse.json({ message: 'Session created', body });
}

export async function GET() {
  // Return list of user sessions
  const sessions = [{ id: 1, token: 'abc123' }];
  return NextResponse.json(sessions);
}
