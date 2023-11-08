'use client';

import React from 'react';
import type { Workflow, User } from '@models';
import Detail from './_component/detail'
import { demoData } from './_component/index';
import NodeForm from './_component/form';

export type Props = {
  workflow: Workflow;
  users: ReadonlyModel<User>[];
};

const PageClient: React.FC<Props> = (props) => {
  const { users } = props;
  return (
    <NodeForm nodes={demoData}>
      <Detail users={users} />
    </NodeForm>
  );
};
export default PageClient;
