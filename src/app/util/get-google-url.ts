import logStore from "../store/logs";

function getGoogleOAuthURL(): string {

  const updateLogs = logStore((state) => state.setLog);

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!redirectUri || !clientId) {
    throw new Error('Missing Google OAuth environment variables.');
  }

  const options = {
    redirect_uri: redirectUri,
    client_id: clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  // Create a query string to use as params from the options object
  const queryString = new URLSearchParams(options).toString();

  console.log({queryString});
  const paramsMsg = `added redirect_uri, client_id as query params to Google OAuth URL` ;
  const redirectMsg = `redirect to Google OAuth URL: ${rootUrl}...`;
  updateLogs(paramsMsg + '\n' + redirectMsg)
  return `${rootUrl}?${queryString}`;
}

export default getGoogleOAuthURL;

