'use client';

import styles from './page.module.css';
import useSWR from 'swr';
import fetcher from './util/fetcher';
import getGoogleOAuthURL from './util/get-google-url';
import { useRouter } from 'next/navigation';
import { logStore } from './store/logs';

interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  session: string;
  iat: number;
  exp: number;
}

console.log({ processEnv: process.env.NEXT_PUBLIC_SERVER_ENDPOINT });

export default function Home() {
  const router = useRouter();
  const { data, error, isValidating } = useSWR<User | null>(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    fetcher,
  );
  const logs = logStore((state) => state.logs);
  const updateLogs = logStore((state) => state.setLog);
  console.log({ logs }); 
  const logList = (
    <section>
      {logs.map((log : string, i : number) => (
        <h3 key={i}>{log}</h3>
      ))}
    </section>
  );
  const handleClearCookiesClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    updateLogs('Clicked clear cookies...');
    // clear cookies
    
  }

  const clearCookiesSection = (
    <section>
      <button onClick={handleClearCookiesClick}>Clear Cookies</button>
    </section>)
        

  if (data) {
    return <div>
      <div>Welcome! {data.name}</div>
      {clearCookiesSection}
      {logList}
      </div>
  }
  if (error) {
    console.error(error);
    return <div>Failed to load user data</div>
  }
  if (isValidating) {
    return <div>Loading...</div>
  }

  const handleLoginClick = async (e) => {
    e.preventDefault();
    updateLogs('Clicked log in...');

    try {
      // TODO: record progress
      router.push(getGoogleOAuthURL());
    } catch (error) {
      console.error('Error during login:', error);
      // TODO: Handle error appropriately
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={handleLoginClick}>Please login</button>
      {logList}
    </div>
  );
}
