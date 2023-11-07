import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import Client, { Props } from './client';
import { Workflow, User } from '@models';
import { Card, CardHeader, Container } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

export default async function Page({ params }: { params: { id: string } }) {
  const workflow = await getWorkflow(params.id);
  const users = await getUsers();

  return (
    <>
      <Container component={Card} maxWidth='lg' sx={{ minHeight: '60vh', mt: '0.8rem' }} elevation={2}>
        <CardHeader
          avatar={<AccountTreeIcon fontSize='large' color='action' />}
          title={workflow.name}
          titleTypographyProps={{ variant: "h4" }}
          subheader={workflow.name}
        />
        <Client {...{ workflow, users }} />
      </Container>
    </>
  );
}
/*
export async function generateStaticParams() {
  const keys = (await Workflow.findAll()).map(( { id } ) => ({ id }));

  return keys;
}
*/
const getWorkflow = async (id: string): Promise<Props['workflow']> => {
  const workflow = (await Workflow.findByPk(id))?.toJSON();
  if (!workflow) {
    throw new PageNotFoundError('not found');
  }
  return workflow;
};

const getUsers = async (): Promise<Props['users']> => {
  const users = (await User.findAll()).map((item) => {
    const model = item.toJSON();
    return { ...model, id: model.id || 0} as User & {id: number};
  });
  return users.filter((model) => !!model.id);
};
