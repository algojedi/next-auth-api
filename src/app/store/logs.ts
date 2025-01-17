import { create } from 'zustand';


interface LogState {
	logs: string[];
	setLog: (log: string) => void;
}

export const logStore = create<LogState>((set) => ({
	logs : ['init'],	
	setLog: (log : string) => set({ logs: [...logStore.getState().logs, log] }),
}));