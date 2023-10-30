//import axios, { HttpStatusCode } from 'axios';
import { headers } from 'next/headers';

/**
 * local url base 生成
 */
export const baseUrl = () => {
  const urls = headers().get('referer')?.split('/');
  const scheme = urls?.shift();
  urls?.shift();
  const host = urls?.shift();
  return `${scheme}//${host}`;
}

export type LocalFetchFunction = <T = unknown>(
  apiPath: string,
  options?: NodeJS.fetch._RequestInit
) => Promise<{
  data: T;
  errorCode: number | false;
}>;

export const localFetch: LocalFetchFunction = async <T = unknown>(
  apiPath: string,
  options: NodeJS.fetch._RequestInit
) => {
  const result = await fetch(`${baseUrl()}/api${apiPath}`, options);
  const errorCode = result.ok ? false : result.status;

  const data = (await result.json()) as T;
  return {
    data,
    errorCode,
  };
};

export const localServerFetch: LocalFetchFunction = async <T = unknown>(
  apiPath: string,
  options: NodeJS.fetch._RequestInit = {}
) => {
  const init = { cache: 'no-store', ...options };
  return await localFetch<T>(apiPath, init);
};

export const localStaticFetch: LocalFetchFunction = async <T>(
  apiPath: string,
  options: NodeJS.fetch._RequestInit = {}
) => {
  return await localFetch<T>(apiPath, options);
};

export const jsonPost = async <T = unknown>(
  apiPath: string,
  body: Record<string, unknown>
) => {
  //const body = { a: 1 };
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  };

  return await localServerFetch<T>(apiPath, options);
};
