//import type { NextApiRequest, NextApiResponse } from 'next'
import { Workflow } from '@models';
import type { WorkflowAttributes } from '@models/workflow.model';

type Params = { params: { id: string } };

export async function GET(req: Request, { params }: Params) {
  const { id } = params;
  if (!id) return new Response('param key is not found', { status: 500 });

  const workflow = (await show(id))?.toJSON();

  return Response.json({ workflow })
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = params;
  const req = await request.json();

  if (!isPatchRequestBody(req)) {
    return new Response('invalid body', { status: 500 });
  }
  const workflow = (await update(id, req.workflow))?.toJSON();
  return Response.json({ workflow })
}

export async function DELETE(req: Request, { params }: Params) {
  const { id } = params;

  const workflow = (await destroy(id))?.toJSON();
  return Response.json({ workflow })
}

export type ResponseData = {
  workflow: WorkflowAttributes | null;
};

export type PatchRequestBody = {
  workflow: WorkflowAttributes;
};

function isPatchRequestBody(arg: Record<string, unknown>): arg is PatchRequestBody {
  return arg.workflow !== undefined;
}
/*
interface PostApiRequest extends NextApiRequest{
  body: PostRequestBody
}

function isPostApiRequest(arg: Request | NextApiRequest | PostApiRequest): arg is PostApiRequest {
  return arg.body.workflow !== undefined;
}


// const handler: NextApiHandler<ResponseData> = async (req, res) => {
export default async function handler(
  req: NextApiRequest | PostApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const id = req.query.id as string;

    if (req.method === 'GET') {
      const workflow = await show(id);
      res.status(200).json({ workflow });
    } else if (req.method === 'DELETE') {
      const workflow = await destroy(id);
      res.status(200).json({ workflow });
    } else if (req.method === 'PATCH') {
      if (!isPostApiRequest(req)) {
        res.status(500);
        return;
      }
      const workflow = await update(id, req.body.workflow);
      res.status(200).json({ workflow });
    } else {
      res.status(501);
    }
  } catch (error) {
    res.status(500).json(error);
  }
}
*/
const show = async (id: string) => {
  const model = await Workflow.findByPk(id);
  return model;
}

const destroy = async (id: string) => {
  const model = await Workflow.findByPk(id);
  if (model) {
    await model.destroy();
  }
  return model;
}
const update = async (
  id: string,
  workflow: WorkflowAttributes
) => {
  const [ affectedCount ] = await Workflow.update(workflow, {
    where: { id },
  })
  if (affectedCount) {
    const model = await Workflow.findByPk(id);
    return model;
  }
  return null;
}
