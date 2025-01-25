'use client';

import Image from 'next/image';
import styles from './page.module.css';
import useSWR, { mutate } from 'swr';
import fetcher from './util/fetcher';
import getGoogleOAuthURL from './util/get-google-url';
import { useRouter } from 'next/navigation';
import { logStore } from './store/logs';
import { User } from './types/user-types';
import { useEffect } from 'react';

function Home() {
  const router = useRouter();
  const { data, error, isValidating } = useSWR<User | null>(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    fetcher,
  );
  const logs = logStore((state) => state.logs);
  const updateLogs = logStore((state) => state.setLog);
  const resetLogs = logStore((state) => state.resetLogs);
  console.log({ logs });

  useEffect(() => {
    if (data) {
      updateLogs('User data loaded via access token in cookie');
    }
  }, [data, updateLogs]); // Only runs when `data` or `updateLogs` changes

  const logList = (
    <ul className={styles.logList}>
      {logs.map((log : string, i : number) => (
        <li key={i}>{log}</li>
      ))}
    </ul>
  );


  const handleClearCookiesClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    // make axios request to server to clear cookies
    try {
      console.log('making axios request...');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions/logout`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      // clear the swr cache
      if (response.ok) {
        mutate(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`, null, false);
        resetLogs();
      }

    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
    const clearCookiesSection = (
      <section>
        <button onClick={handleClearCookiesClick} className={styles.button}>Clear Cookies</button>
      </section>
    );

    if (data) {
      return (
        <div>
          <div>Welcome! {data.name}</div>
          <Image
            src={data.picture}
            alt='User profile picture'
            width={96}
            height={96}
          />

          {clearCookiesSection}
          {logList}
        </div>
      );
    }
    if (error) {
      console.error(error);
      return <div>Failed to load user data</div>;
    }
    if (isValidating) {
      return <div>Loading...</div>;
    }

    const handleLoginClick = async (e) => {
      e.preventDefault();
      updateLogs('Clicked log in...');

      try {
        // TODO: record progressGET
        router.push(getGoogleOAuthURL());
      } catch (error) {
        console.error('Error during login:', error);
        // TODO: Handle error appropriately
      }
    };

    return (
      <div className={styles.container}>
        <button className={styles.button} onClick={handleLoginClick}>Please login</button>
        {logList}
      </div>
    );
  };

export default Home;