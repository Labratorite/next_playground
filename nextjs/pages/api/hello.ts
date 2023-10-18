import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  text: string;
}

// https://nextjs.org/docs/pages/building-your-application/routing/api-routess
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ text: 'Hello' });
}
