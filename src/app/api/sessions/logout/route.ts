import { deleteSession } from '@/app/db/session-service';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req : NextRequest) {
  // Simulate session deletion
  // delete cookies
  console.log({req})
  const clientCookies = await cookies();
  // const currAccessToken = cookies.get('accessToken');
  // const currRefreshToken = cookies.get('refreshToken');
  clientCookies.set('accessToken', '', { maxAge: 0 });
  clientCookies.set('refreshToken', '', { maxAge: 0 });

  return NextResponse.json({ message: 'Session deleted' });
}
