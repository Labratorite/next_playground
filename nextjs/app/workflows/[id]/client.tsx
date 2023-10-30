'use client';

import React from 'react';
import { Workflow } from '@models';

export type Props = {
  workflow: Workflow;
};

const Page: React.FC<Props> = (props) => {
  const { workflow } = props;

  return (
    <>
      <h1>{ workflow.name }</h1>
    </>
  );
};
export default Page;
