'use client';

import React from 'react';
import { Workflow } from '@models';
import Detail from './_component/detail'

export type Props = {
  workflow: Workflow;
};

const PageClient: React.FC<Props> = (props) => {
  const { workflow } = props;

  const dummy = () => {
    console.log('dummy');
  };
  return (
    <>
      <Detail data={workflow} deleteWorkflow={dummy} addNode={dummy} />
    </>
  );
};
export default PageClient;
