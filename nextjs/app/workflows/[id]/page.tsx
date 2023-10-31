import { PageNotFoundError } from 'next/dist/shared/lib/utils';
import Client, { Props } from './client';
import { Workflow } from '@models';
import { Card, CardContent, CardHeader, Container, Stack } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

export default async function Page({ params }: { params: { id: string } }) {
  const props = await getWorkflows(params.id);

  return (
    <>
      <Container component={Card} maxWidth='lg' sx={{ minHeight: '50vh', mt: '0.8rem' }} elevation={2}>
        <CardHeader
          avatar={<AccountTreeIcon fontSize='large' color='action' />}
          title={props.workflow.name}
          titleTypographyProps={{ variant: "h4" }}
          subheader={props.workflow.name}
        />
        <CardContent component={Stack} direction="row" sx={{ overflowX: 'auto' }}>
          <Client {...props} />
        </CardContent>
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
const getWorkflows = async (id: string): Promise<Props> => {
  const workflow = (await Workflow.findByPk(id))?.toJSON();
  if (!workflow) {
    throw new PageNotFoundError('not found');
  } else {
    return { workflow };
  }
};
