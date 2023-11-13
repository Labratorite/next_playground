import { Workflow } from '@models';
import type { WorkflowAttributes, WorkflowCreationAttributes } from '@models/workflow.model';

export type ResponseData = {
  workflow: WorkflowAttributes;
};

export type ResponseListData = {
  workflows: WorkflowAttributes[];
};

export type PostRequestBody = {
  workflow: WorkflowCreationAttributes;
};

function isPostRequestBody(arg: Record<string, unknown>): arg is PostRequestBody {
  return arg.workflow !== undefined;
}

export async function GET() {
  const workflows = await Workflow.findAll();
  return Response.json({ workflows });
}

export async function POST(request: Request) {
  const req = await request.json();

  if (!isPostRequestBody(req)) {
    return new Response('invalid body', { status: 500 });
  }
  const workflow = (await store(req.workflow))?.toJSON();
  return Response.json({ workflow });
}

const store = async (workflow: WorkflowCreationAttributes) => {
  //const [model, created] = await Workflow.upsert(workflow);
  try {
    const model = await Workflow.create(workflow);
    return model;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
