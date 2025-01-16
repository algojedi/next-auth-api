import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { GoogleTokenResult, GoogleUser } from '@/app/types/user-types';
import { upsertUser } from '@/app/db/user-service';
import { cookies, headers } from 'next/headers';
import { createSession } from '@/app/db/session-service';
import { signJwt } from '@/app/util/jwt-utils';

export async function GET(req: NextRequest, res: NextResponse) {
  console.log('hitting get route for sessions/oauth/google -- GET');
  const { origin, accessTokenTtl, refreshTokenTtl } = process.env;

  const code = req.nextUrl?.searchParams.get('code');

  // get the id and access_token using the code
  const endpoint = process.env.GoogleClientSecret;
  console.log({ endpoint });
  const URL = 'https://oauth2.googleapis.com/token';
  const values = {
    grant_type: 'authorization_code',
    code,
    client_id: process.env.GoogleClientID,
    client_secret: process.env.GoogleClientSecret,
    redirect_uri: process.env.GoogleOauthRedirectURL,
  };

  // get user info using the access_token
  try {
    const response = await axios.post<GoogleTokenResult>(URL, values, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    // should receive an id_token and access_token
    const { access_token, id_token } = response.data;
    console.log({ access_token, id_token });
    // create a session for the user

    // save the user info in the database
    const googleUser = jwt.decode(id_token) as GoogleUser;
    if (!googleUser) {
      throw new Error('could not decode google user');
    }

    if (!googleUser.email_verified) {
      throw new Error('google user is not verified');
    }

    const { email, name, picture } = googleUser;
    const user = await upsertUser({ email, name, picture });
    console.log({ user });

    // create a session for the user
    const userAgent = (await headers()).get('user-agent');
    const session = await createSession(user.id, userAgent || '');
    console.log({ session });

    // create access_token and refresh_token for the user
    const tokenPayload = { ...user, sessionId: session.id }

    const accessToken = signJwt(
      tokenPayload,
      {
        expiresIn: accessTokenTtl
      },
    );

    const refreshToken = signJwt(
      tokenPayload,
      {
        expiresIn: refreshTokenTtl
      },
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as 'none' | 'lax' | 'strict' | undefined,
    };

    console.log({ accessToken, refreshToken });

    // Set the cookie
    (await cookies()).set('refreshToken', refreshToken, {
      ...cookieOptions,
      // res,
      maxAge: 60 * 60 * 24 * 365, // set maxAge to 1 year
    });

    (await cookies()).set('accessToken', accessToken, {
      ...cookieOptions,
      // res,
      maxAge: 60 * 15, // set maxAge to 15 minutes
    });

    // redirect to the home page
    return NextResponse.redirect(origin as string);
    
  } catch (error) {
    // TODO: handle error
    console.log('error in GET /sessions/oauth/google');
    console.log({ error });
    return NextResponse.redirect(`${origin}/oauth/error`);
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  console.log('hitting get route for sessions/oauth/google -- POST');
  const code = req.body?.code;
  const endpoint = process.env.GoogleClientSecret;
  // const URL = 'http://oauth2.googleapis.com/token';
  const values = {
    grant_type: 'authorization_code',
    code,
    client_id: process.env.GoogleClientID,
    client_secret: process.env.GoogleClientSecret,
    redirect_uri: process.env.GoogleOauthRedirectURL,
  };
  console.log({ values, endpoint });
  return NextResponse.json({ message: 'Session created', body: req.body });
}
