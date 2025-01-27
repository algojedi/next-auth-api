
import { cookies } from 'next/headers';

export const oneYear = 60 * 60 * 24 * 365;
export const fifteenMinutes = 60 * 15;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as 'none' | 'lax' | 'strict' | undefined,
};

export async function createCookie(
  name: string,
  value: string,
  maxAge: number,
) {
  (await cookies()).set(name, value, {
    ...cookieOptions,
    maxAge,
  });
}

export async function deleteCookie(name: string) {
	(await cookies()).delete(name);
}

export async function getCookie(name: string) {
	return (await cookies()).get(name);
}

export async function saveServerLog(...newLogs: string[]) {
	// retrieve the log from cookies and parse
	const logs = (await getCookie('logs'))?.value;
	const parsedLogs = logs ? JSON.parse(logs) : [];
	parsedLogs.push(...newLogs);
	(await cookies()).set('logs', JSON.stringify(parsedLogs));
}