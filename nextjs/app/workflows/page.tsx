import ClientPage, { Props } from './client'
import { Workflow } from 'db/models';
//import { UserRepository } from 'db/repositories/UserRepository';
//import { localServerFetch } from '@api/index';
//import { ResponseData } from '@api/list';

export default async function Page() {
  const props = await getWorkflows()

  return <ClientPage {...props} />
}

export const getWorkflows = async (): Promise<Props> => {
  const workflows = (await Workflow.findAll()).map((model) => model.toJSON());
  return { workflows, type: "Success" };
};
