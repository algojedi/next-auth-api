"use client"

import styles from "./page.module.css";
import useSWR from "swr";
import fetcher from "./util/fetcher";
import getGoogleOAuthURL from "./util/get-google-url";
import { useRouter } from "next/navigation";

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

    console.log({ processEnv : process.env.NEXT_PUBLIC_SERVER_ENDPOINT})

export default function Home() {
  const router = useRouter();
  const { data, error, isValidating } = useSWR<User | null>(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    fetcher,
  );

    if (data) {
      return <div>Welcome! {data.name}</div>;
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
      </div>
    );
  };


