import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { GoogleTokenResult, GoogleUser } from '@/app/types/user-types';
import { upsertUser } from '@/app/db/user-service';
import { cookies, headers } from 'next/headers';
import { createSession } from '@/app/db/session-service';
import { signJwt } from '@/app/util/jwt-utils';
// import logStore from '@/app/store/logs';

export async function GET(req: NextRequest, res: NextResponse) {
  // const updateLogs = logStore((state) => state.setLog);
  // updateLogs('hitting GET route for sessions/oauth/google');
  const { origin, accessTokenTtl, refreshTokenTtl } = process.env;

  const code = req.nextUrl?.searchParams.get('code');
  if (!code) {
    console.log('no code found in query params');
    return NextResponse.redirect(`${origin}/oauth/error`);
  }
  // updateLogs('extracted code from query params');

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
    // updateLogs('POST request to Google OAuth includes client id and secret');
    const response = await axios.post<GoogleTokenResult>(URL, values, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    // should receive an id_token and access_token
    const { access_token, id_token } = response.data;
    // updateLogs('received id_token and access_token from Google OAuth token endpoint');
    // console.log({ access_token, id_token });
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
    // updateLogs('decoded and then saved google user info from id_token');
    const user = await upsertUser({ email, name, picture });
    // updateLogs('upserted user in app database');

    // create a session for the user
    const userAgent = (await headers()).get('user-agent');
    const session = await createSession(user.id, userAgent || '');
    // updateLogs('created session for user in app database');

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
    // updateLogs('created access_token and refresh_token JWTs to send to user');

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as 'none' | 'lax' | 'strict' | undefined,
    };

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
    // updateLogs('set refresh and access tokens in cookies');
    // updateLogs('redirecting to home page');

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
  console.log('hitting route for sessions/oauth/google -- POST');
  // const updateLogs = logStore((state) => state.setLog);
  // updateLogs('hitting POST route for sessions/oauth/google');
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
  return NextResponse.json({ message: 'Session created', body: req.body });
}
