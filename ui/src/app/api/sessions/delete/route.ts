import { NextResponse } from 'next/server';

export async function DELETE() {
  // Simulate session deletion
  return NextResponse.json({ message: 'Session deleted' });
}
