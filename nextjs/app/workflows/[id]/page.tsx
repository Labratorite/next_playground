import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import Client, { Props } from './client';
import { Workflow, User } from 'db/models';
import { Card, CardHeader, Container } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

export default async function Page({ params }: { params: { id: string } }) {
  const workflow = await getWorkflow(params.id);
  const users = await getUsers();
  console.debug('Page', params.id);

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
  const keys = (await Workflow.findAll()).map((model) => ({ id: model.toJSON().id.toString() }));

  return keys;
}
*/
const getWorkflow = async (id: string): Promise<Props['workflow']> => {
  console.debug('getWorkflow');
  const workflow = (await Workflow.findByPk(id, {
    include: {
      association: 'nodes',
      include: [{
        association: 'approvers',
        include: [{
          association: 'approver',
          attributes: [
            'id', 'nickname', 'firstName', 'lastName', 'fullName'
          ]
        }],
      }],
    },
    order: [
      ['nodes', 'nodeLv', 'ASC'],
      ['nodes', 'approvers', 'orderNo', 'ASC'],
    ],
  }))?.toJSON<Props['workflow']>();
  // ↑eager loading 時の戻り値の型が対応されていなかった。WorkflowAttributesが戻ってくる

  if (!workflow) {
    throw new PageNotFoundError('not found');
  }
  return workflow;
};

const getUsers = async (): Promise<Props['users']> => {
  console.debug('getUsers');
  return (await User.findAll()).map((item) => item.toJSON());
};
