import { getCookie } from "cookies-next";

export function saveLog(...newLogs: string[]) {
	// retrieve the log from sessionStorage and parse
	const logs = sessionStorage.getItem('logs');
	const parsedLogs = logs ? JSON.parse(logs) : [];
	parsedLogs.push(...newLogs);
	sessionStorage.setItem('logs', JSON.stringify(parsedLogs));
}

export function resetLogs() {
	sessionStorage.removeItem('logs');
}

export function getLogs() : string[] {
	const logs = sessionStorage.getItem('logs');
	return logs ? JSON.parse(logs) : [];
}

// server logs are stored in a 'logs' cookie
export async function getServerLogs() : Promise<string[]> {
	const serverLogsJSON = await getCookie('logs');
	if (!serverLogsJSON) return ['no server logs'];
	return JSON.parse(serverLogsJSON);
}