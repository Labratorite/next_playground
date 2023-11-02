'use client';

import React from 'react';
import { Workflow, User } from '@models';
import Detail from './_component/detail'

export type Props = {
  workflow: Workflow;
  users: (User & {id: number})[];
};

const PageClient: React.FC<Props> = (props) => {
  const { workflow, users } = props;

  const dummy = () => {
    console.log('dummy');
  };
  return (
    <>
      <Detail data={workflow} users={users} deleteWorkflow={dummy} addNode={dummy} />
    </>
  );
};
export default PageClient;
