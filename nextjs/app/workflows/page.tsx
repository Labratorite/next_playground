import ClientPage, { Props } from './client'
import { sequelize } from 'db/models';
//import { UserRepository } from 'db/repositories/UserRepository';
//import { localServerFetch } from '@api/index';
//import { ResponseData } from '@api/list';

export default async function Page() {
  const props = await getWorkflows()

  return <ClientPage {...props} />
}

const getWorkflows = async (): Promise<Props> => {
  const workflows = (await sequelize.models["Workflow"].findAll()).map((model) => model.toJSON());
  return { workflows, type: "Success" };
};
