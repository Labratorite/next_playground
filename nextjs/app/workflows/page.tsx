import ClientPage, { Props } from './client'
import { Workflow } from 'db/models';
import type { WorkflowCreationAttributes } from '@models/workflow.model';
//import { UserRepository } from 'db/repositories/UserRepository';
//import { localServerFetch } from '@api/index';
//import { ResponseData } from '@api/list';

//import { revalidatePath } from 'next/cache';

export default async function Page() {
  const props = await getWorkflows()

  return <ClientPage {...props} storeWorkflow={storeWorkflow} />
}

const getWorkflows = async (): Promise<Props> => {
  const workflows = (await Workflow.findAll()).map((model) => model.toJSON());
  return { workflows, type: "Success" };
};

async function storeWorkflow(attributes: WorkflowCreationAttributes) {
  'use server';
  const model = (await Workflow.create(attributes)).dataValues;
  //revalidatePath('/workflows', 'page');
  return model;
}
