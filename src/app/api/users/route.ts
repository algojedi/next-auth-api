import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  // Add user creation logic here
  return NextResponse.json({ message: 'User created', body });
}
