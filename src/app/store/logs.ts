import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface LogState {
  logs: string[];
  setLog: (log: string) => void;
  resetLogs: () => void;
}

const initialState = ['init'];

export const logStore = create(
  persist<LogState>(
    (set) => ({
      logs: initialState,
      resetLogs: () => set({ logs: initialState }),
      setLog: (log: string) =>
        set((state: LogState) => ({ logs: [...state.logs, log] })),
    }),
    {
      name: 'log-store',
      storage: createJSONStorage(() => localStorage)
    },
  ),
);

export default logStore;
