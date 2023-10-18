import { GetServerSideProps } from "next";
import Error from 'next/error'
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import useSWR from 'swr';
import { User } from "@models/index";

type Props = {
  message: string;
  users?: User[];
  headers?: unknown;
  errorCode?: number | false;
};

const Profile: React.FC = () => {
  const { data, error } = useSWR('/api/list', (...args) => fetch(...args).then(res => res.json()));

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  console.log('data', data);
  return <div>hello !</div>;
}

const FirstPost: React.FC<Props> = (props) => {
  if (props.errorCode) {
    return <Error statusCode={props.errorCode} />
  }

  const [test, setTest] = React.useState(0);
  return (
    <>
      <Head>
        <title>First Post</title>
      </Head>
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />
      <h1>First Post {test}</h1>
      <Profile />
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
    </>
  );
}

export default FirstPost;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { req } = context;
  const arr = req.headers.referer.split('/');
  const url = `${arr[0]}//${req.headers.host}`;

  const result = await fetch(`${url}/api/list`);
  const errorCode = result.ok ? false : result.status

  const data = await result.json();
  if (result.ok) {
    return {
      props: {
        users: data.users,
        message: data.message,
        headers: req.headers,
        errorCode
      },
    };
  } else {
    return {
      props: {
        message: "test" + (data.message || data.error),
        errorCode
      },
    };
  }
};
