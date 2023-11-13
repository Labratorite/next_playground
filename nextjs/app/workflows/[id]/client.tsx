'use client';

import React from 'react';
import type { WorkflowAttributes } from '@models/workflow.model';
import type { UserAttributes } from '@models/user.model';
import type { Node } from './_component/form';
import NodeForm from './_component/form';
import Detail from './_component/detail'

export type Props = {
  workflow: WorkflowAttributes & { nodes: Node[] };
  users: UserAttributes[];
};

const PageClient: React.FC<Props> = (props) => {
  const { workflow, users } = props;

  const nodes = React.useMemo<Node[]>(() => (workflow.nodes?.length)? workflow.nodes : [{
    workflowId: workflow.id,
    nodeLv: 1,
    operator: null,
    isRoot: true,
    isReaf: true,
    approvers: [],
  }], [workflow]);

  return (
    <NodeForm workflowId={workflow.id} nodes={nodes}>
      <Detail workflowId={workflow.id} users={users} />
    </NodeForm>
  );
};
export default PageClient;
