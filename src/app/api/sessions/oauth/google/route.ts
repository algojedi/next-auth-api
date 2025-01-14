import axios from 'axios';
import config from 'config';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { GoogleUser } from '@/app/types/user-types';
import { upsertUser } from '@/app/db/user-service';
import { headers } from 'next/headers';
import { createSession } from '@/app/db/session-service';
import { signJwt } from '@/app/util/jwt-utils';
import { setCookie } from 'cookies-next';

interface GoogleTokenResult {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export async function GET(req: NextRequest, res: NextResponse) {
  console.log('hitting get route for sessions/oauth/google -- GET');
  const code = req.nextUrl?.searchParams.get('code');
  console.log({ code });

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
  console.log({ values });

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
    // const userAgent = req.headers.get('user-agent');
    const userAgent = (await headers()).get('user-agent');
    const session = await createSession(user.id, userAgent || '');
    console.log({ session });

    // create access_token and refresh_token for the user
    const accessToken = signJwt(
      { ...user, sessionId: session.id },
      {
        expiresIn: config.get('accessTokenTtl'),
      },
    );
    const refreshToken = signJwt(
      { ...user, sessionId: session.id },
      {
        expiresIn: config.get('refreshTokenTtl'),
      },
    );

    // Set the cookie
    setCookie('refreshToken', refreshToken, {
      res,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      // set maxAge to 1 year
      maxAge: 60 * 60 * 24 * 365,
    });
    setCookie('accessToken', accessToken, {
      res,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      // set maxAge to 15 minutes
      maxAge: 60 * 15,
    });

    // redirect to the home page
    return NextResponse.redirect(config.get('baseUrl'));
  } catch (error) {
    // TODO: handle error
    console.log('error getting google oauth tokens');
    console.log({ error });
  }

  return NextResponse.json({ message: 'Session created', body: req.body });
}

export async function POST(req: NextRequest, res: NextResponse) {
  console.log('hitting get route for sessions/oauth/google -- POST');
  const code = req.body?.code;
  console.log({ body: req.body, code });
  const endpoint = process.env.GoogleClientSecret;
  console.log({ endpoint });
  // const URL = 'http://oauth2.googleapis.com/token';
  const values = {
    grant_type: 'authorization_code',
    code,
    client_id: process.env.GoogleClientID,
    client_secret: process.env.GoogleClientSecret,
    redirect_uri: process.env.GoogleOauthRedirectURL,
  };
  console.log({ values });

  return NextResponse.json({ message: 'Session created', body: req.body });
}
