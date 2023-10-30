import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import ClientPage, { Props } from './client'
import { Workflow } from '@models';

export default async function Page({ params }: { params: { id: string } }) {
  const props = await getWorkflows(params.id)

  return <ClientPage {...props} />
}
/*
export async function generateStaticParams() {
  const keys = (await Workflow.findAll()).map(( { id } ) => ({ id }));

  return keys;
}
*/
const getWorkflows = async (id: string): Promise<Props> => {
  const workflow = (await Workflow.findByPk(id))?.toJSON();
  if (!workflow) {
    throw new PageNotFoundError('not found');
  } else {
    return { workflow };
  }
};
