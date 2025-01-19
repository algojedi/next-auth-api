export interface GoogleUser {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}
export interface GoogleTokenResult {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  password: string | null;
  picture: string;
  createdAt: string; // You can also use Date if you want to convert this to a Date object
  sessionId: number;
  iat: number;
  exp: number;
}

