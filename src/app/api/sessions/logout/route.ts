import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req : NextRequest) {
  // Simulate session deletion
  const clientCookies = await cookies();
  clientCookies.set('accessToken', '', { maxAge: 0 });
  clientCookies.set('refreshToken', '', { maxAge: 0 });
  // TODO: delete session from database

  return NextResponse.json({ message: 'Session deleted' });
}
