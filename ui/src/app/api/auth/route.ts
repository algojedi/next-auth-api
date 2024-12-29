import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'OAuth initiated' });
}

export async function POST() {
  return NextResponse.json({ message: 'Token exchanged' });
}
