import { Workflow } from '@models';

export type ResponseData = {
  workflow: Workflow;
};

export type ResponseListData = {
  workflows: Workflow[];
};

export type PostRequestBody = {
  workflow: Workflow;
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

const store = async (workflow: Workflow) => {
  //const [model, created] = await Workflow.upsert(workflow);
  try {
    const model = await Workflow.create(workflow);
    return model;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
