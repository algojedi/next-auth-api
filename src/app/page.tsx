'use client';

import Image from 'next/image';
import styles from './page.module.css';
import useSWR, { mutate } from 'swr';
import fetcher from './util/client/fetcher';
import getGoogleOAuthURL from './util/get-google-url';
import { useRouter } from 'next/navigation';
import { User } from './types/user-types';
import { useEffect, useState } from 'react';
import { getLogs, resetLogs, saveLog } from './util/client/storage';

function Home() {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);
  const { data, error, isValidating } = useSWR<User | null>(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    fetcher,
  );
  console.log({ logs });

  useEffect(() => {
    if (data) {
      saveLog('User data loaded via access token in cookie');
    }
  }, [data]);

  useEffect(() => {
    // Fetch or get logs when the component mounts or logs change
    const logsFromStore = getLogs(); // session storage logs
    console.log('useEffect setting logs')
    setLogs(logsFromStore);
  }, []);

  const logList = (
    <ul className={styles.logList}>
      {logs.map((log, i) => (
        <li
          key={i}
          className={
            log.includes('redirect to Google OAuth URL:') ? styles.redText : ''
          }
        >
          {log}
        </li>
      ))}
    </ul>
  );

  // TODO: display server logs from cookie data -- must first decode the cookie data
  // const serverLogList = (
  //   <ul className={styles.logList}>
  //     {logs.map((log, i) => (
  //       <li
  //         key={i}
  //       >
  //         {log}
  //       </li>
  //     ))}
  //   </ul>
  // );

  const handleClearCookiesClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    // make axios request to server to clear cookies
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions/logout`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      // clear the swr cache
      if (response.ok) {
        mutate(
          `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
          null,
          false,
        );
        resetLogs(); // clear cookies
        setLogs([]); // clear ui
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  const clearCookiesSection = (
    <section>
      <button onClick={handleClearCookiesClick} className={styles.button}>
        Clear Cookies
      </button>
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

  const handleClearSessionClick = async (e) => {
    e.preventDefault();
    resetLogs();
    setLogs([]);
    
  };


  const handleLoginClick = async (e) => {
    e.preventDefault();
    saveLog('Clicked log in...');

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
      <button className={styles.button} onClick={handleLoginClick}>
        Please login
      </button>
      <button className={styles.buttonClear} onClick={handleClearSessionClick}>
        Clear Session
      </button>
      {logList}
    </div>
  );
}

export default Home;
