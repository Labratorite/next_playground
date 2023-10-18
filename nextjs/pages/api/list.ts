import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@models/index';

export type ResponseData = {
  message?: string;
  users?: User[];
  error?: string;
}

interface ApiRequest extends NextApiRequest{
  body:{
      email:string
  }
}

// const handler: NextApiHandler<ResponseData> = async (req, res) => {
export default async function handler(
  req: ApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: 'Hello from Next.js!', users })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }

}
