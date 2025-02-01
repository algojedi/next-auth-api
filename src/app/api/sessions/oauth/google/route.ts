import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { GoogleTokenResult, GoogleUser } from '@/app/types/user-types';
import { upsertUser } from '@/app/db/user-service';
import { headers } from 'next/headers';
import { createSession } from '@/app/db/session-service';
import { signJwt } from '@/app/util/shared/jwt-utils';
import { createCookie, fifteenMinutes, oneYear, saveServerLog } from '@/app/util/server/cookies';

export async function GET(req: NextRequest, res: NextResponse) {
  const { origin, accessTokenTtl, refreshTokenTtl } = process.env;

  const code = req.nextUrl?.searchParams.get('code');
  if (!code) {
    console.log('no code found in query params');
    return NextResponse.redirect(`${origin}/oauth/error`);
  }
  saveServerLog('extracted code from query params');

  // get the id and access_token using the code
  // const endpoint = process.env.GoogleClientSecret;
  // console.log({ endpoint });
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
    saveServerLog('POST request to Google OAuth includes client id and secret');
    const response = await axios.post<GoogleTokenResult>(URL, values, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    // should receive an id_token and access_token
    // const { access_token, id_token } = response.data;
    const { _, id_token } = response.data;
    saveServerLog(
      'received id_token and access_token from Google OAuth token endpoint',
    );
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
    saveServerLog('decoded and then saved google user info from id_token');
    const user = await upsertUser({ email, name, picture });
    saveServerLog('upserted user in app database');

    // create a session for the user
    const userAgent = (await headers()).get('user-agent');
    const session = await createSession(user.id, userAgent || '');
    saveServerLog('created session for user in app database');

    // create access_token and refresh_token for the user
    const tokenPayload = { ...user, sessionId: session.id };

    const accessToken = signJwt(tokenPayload, {
      expiresIn: accessTokenTtl,
    });

    const refreshToken = signJwt(tokenPayload, {
      expiresIn: refreshTokenTtl,
    });
    saveServerLog('created access_token and refresh_token JWTs to send to user');
    createCookie('refreshToken', refreshToken, oneYear);
    createCookie('accessToken', accessToken, fifteenMinutes);
    saveServerLog(
      'set refresh and access tokens in cookies',
      'redirecting to home page',
    );
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
