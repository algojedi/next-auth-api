import { NextRequest, NextResponse } from "next/server";

// Mock function to simulate token validation and user fetching
export async function getUserFromToken(token: string | undefined): Promise<{
  id: string;
  name: string;
} | null> {
  if (!token) return null;

  // Simulate token validation
  if (token === 'valid_token') {
    return {
      id: '12345',
      name: 'John Doe',
    };
  }

  return null; // Invalid token
}


export async function getUser(req: NextRequest) {
  const authorizationHeader = req.headers.get('Authorization');
  const token = authorizationHeader?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json(
      { message: 'Unauthorized: Token missing' },
      { status: 401 },
    );
  }

  const user = await getUserFromToken(token);

  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorized: Invalid token' },
      { status: 401 },
    );
  }

  // Attach user information to the request headers
  const response = NextResponse.next();
  response.headers.set('X-User-ID', user.id);
  response.headers.set('X-User-Name', user.name);

  return response;
}