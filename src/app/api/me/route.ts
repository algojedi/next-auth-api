import { verifyJwt } from '@/app/util/shared/jwt-utils';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('GET /api/me endpoint hit');
    // Example: Get user data based on some authentication mechanism.

    // const user = await getUserFromSession(request); // Replace with your actual logic.

    // get user from cookie
    // TODO: replace with actual authentication logic using sessions
    const userCookies = await cookies();
    const accessTokenCookie = userCookies.get('accessToken');

    if (!accessTokenCookie) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // decode the access token
    const accessTokenJWT = verifyJwt(accessTokenCookie.value);
    if (!accessTokenJWT || !accessTokenJWT.valid) {
      return NextResponse.json(
        { message: 'Invalid access token' },
        { status: 401 },
      );
    }
    const { decoded: user } = accessTokenJWT;

    if (user) {
      return NextResponse.json(user, { status: 200 });
    }

    // If no user found (e.g., unauthenticated), return an error response.
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Example of a function that retrieves user data, e.g., from a session or token
export async function getUserFromSession(request: Request) {
  // Your logic here to get the user, e.g., using cookies or headers for authentication
  const session = await getSessionFromRequest(request); // Mock function, replace with actual logic
  if (!session || !session.user) return null;
  return session.user; // Return user data if available
}

// Mock of how you might get session data from the request (replace with real authentication logic)
async function getSessionFromRequest(request: Request) {
  // Example: Fetch a session ID from cookies or headers
  const cookies = request.headers.get('cookie');
  console.log({ cookies });
  // Parse cookies and validate session...
  const mockUser = {
    user: { id: 1, name: 'John Doe', email: 'john@example.com' },
  }; // Mock user data
  return cookies ? mockUser : null;
}
