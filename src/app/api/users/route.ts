import { createUser } from '@/app/db/userService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('hitting users post')
  const body = await request.json();
  console.log({ body });
  const { name, email, password } = body;
  const dbResponse = await createUser({
    name,
    email,
    password,
  });
  console.log({ dbResponse });
  return NextResponse.json({ message: 'User created', body });
}
