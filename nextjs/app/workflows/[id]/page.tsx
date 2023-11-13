import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import Client, { Props } from './client';
import { Workflow, User } from '@models';
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
  const keys = (await Workflow.findAll()).map(( { id } ) => ({ id }));

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
  }))?.toJSON();
  if (!workflow) {
    throw new PageNotFoundError('not found');
  }
  // eager loading 時の戻り値の型が対応されていなかった。WorkflowAttributesが戻ってくる
  // 一旦無理やり書き換え
  return workflow as Props['workflow'];
};

const getUsers = async (): Promise<Props['users']> => {
  console.debug('getUsers');
  return (await User.findAll()).map((item) => item.toJSON());
};
