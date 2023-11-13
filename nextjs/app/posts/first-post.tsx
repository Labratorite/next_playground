'use client';

import Error from 'next/error';
import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import useSWR, { Fetcher } from 'swr';
import { UserAttributes } from '@models/user.model';

export type Props = {
  message?: string;
  users?: UserAttributes[];
  headers?: unknown;
  errorCode?: number | false;
};

//const fetcher: Fetcher<User[], string> = (path) => axios.get<User[]>(path).then((res) => res.data);
const fetcher: Fetcher<UserAttributes[], string> = (path) =>
  fetch(path).then((res) => res.json());

const Profile: React.FC = () => {
  const { data, error } = useSWR('/api/list', fetcher);
  /*
  const { data, error } = useSWR('/api/list', (...args) => {
    return fetch(...args).then(res => res.json());
  });
  */

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  console.log('data', data);
  return <div>hello !</div>;
};

const FirstPost: React.FC<Props> = (props) => {
  if (props.errorCode) {
    return <Error statusCode={props.errorCode} />;
  }

  return (
    <>
      <Script
        src='https://connect.facebook.net/en_US/sdk.js'
        strategy='lazyOnload'
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />
      <h1>First Post</h1>
      <Profile />
      <h2>
        <Link href='/'>Back to home</Link>
      </h2>
    </>
  );
};

export default FirstPost;
