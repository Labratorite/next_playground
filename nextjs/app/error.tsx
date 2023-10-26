'use client';

import { useEffect } from 'react';
import NextError from 'next/error';
import { Button } from '@mui/material';
//import { ErrorComponent } from 'next/dist/client/components/error-boundary'

/**
 * https://nextjs.org/docs/app/api-reference/file-conventions/error
 * @param param0
 * @returns
 */
//error.js automatically creates a React Error Boundary that wraps a nested child segment or page.js component.
// https://nextjs.org/docs/app/building-your-application/routing/error-handling#how-errorjs-works
//The root app/error.js boundary does not catch errors thrown in the root app/layout.js or app/template.js component.
//https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-errors-in-root-layouts

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div>
      <h2>
        Something went wrong!
        <Button variant='outlined' onClick={() => reset()} sx={{ ml: '1rem' }}>
          Try again
        </Button>
      </h2>
      <NextError statusCode={500}>test</NextError>
      <div>
        <p>{error.message}</p>
        <code>{error.stack}</code>
      </div>
    </div>
  );
}
