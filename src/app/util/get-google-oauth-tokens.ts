import axios from "axios";

export async function getGoogleOAuthTokens( code : { code: string }) {

	const response = await axios.post(`api/sessions/oauth/google`, {
		body: code,
	});

// check if the response is successful
	if (response.status !== 200) {
		throw new Error('Failed to get Google OAuth tokens');
	}

	console.log({ response });
	return response.data;
	
}