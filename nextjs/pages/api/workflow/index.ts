import type { NextApiRequest, NextApiResponse } from 'next';
import { Workflow } from '@models';

export type ResponseData = {
  workflow: Workflow;
};

export type PostRequestBody = {
  workflow: Workflow;
};

interface PostApiRequest extends NextApiRequest {
  body: PostRequestBody;
}

// const handler: NextApiHandler<ResponseData> = async (req, res) => {
export default async function handler(
  req: PostApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    if (req.method === 'POST') {
      const workflow = await store(req.body.workflow);
      res.status(200).json({ workflow });
    } else {
      res.status(501);
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

const store = async (workflow: Workflow) => {
  //const [model, created] = await Workflow.upsert(workflow);
  const model = await Workflow.create(workflow);
  return model;
};
