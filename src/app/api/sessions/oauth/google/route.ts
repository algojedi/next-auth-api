import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { GoogleUser } from '@/app/types/user-types';

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
    const googleUser = jwt.decode(id_token) as GoogleUser;
    if (!googleUser) {
      throw new Error('could not decode google user');
    }

    if (googleUser.email_verified !== true) {
      throw new Error('google user is not verified');
    }

    // create access_token and refresh_token for the user

    // set the session cookie

    // redirect to the home page
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
  const URL = 'http://oauth2.googleapis.com/token';
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
