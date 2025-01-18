import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface LogState {
  logs: string[];
  setLog: (log: string) => void;
}

export const logStore = create(
  persist<LogState>(
    (set) => ({
      logs: ['init'],
      setLog: (log: string) =>
        set((state: LogState) => ({ logs: [...state.logs, log] })),
    }),
    {
      name: 'log-store',
      storage: createJSONStorage(() => sessionStorage)
    },
  ),
);

export default logStore;
