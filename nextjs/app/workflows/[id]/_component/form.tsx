'use client';
import React from 'react';
import {
  FieldArrayPath,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form';
import type { WorkflowNodeCreationAttributes } from '@models/WorkflowNode.model';
import type { WorkflowApproverCreationAttributes } from '@models/WorkflowApprover.model';
import type { UserAttributes } from '@models/user.model';
import { useProgress } from 'components/progress';
import { useAlert } from 'components/snackbar-alert';
import { syncNodes } from './action';

export type ReadOnlyUser = Pick<UserAttributes, 'id' | 'nickname'>;
export type Approver = Omit<WorkflowApproverCreationAttributes, 'workflowNodeId' | 'approver'> & { approver: ReadOnlyUser };
export type Node = Omit<WorkflowNodeCreationAttributes, 'approvers' | 'workflowNodeId'> & { approvers: Approver[]};

export type WorkflowNodeForm = {
  nodes: Node[];
};

type Props = { children: React.ReactNode; nodes: Node[]; workflowId: number };

export default function NodeForm(props: Props) {
  const { children, nodes, workflowId } = props;
  const methods = useForm<WorkflowNodeForm>({ defaultValues: { nodes } });
  const { handleSubmit, watch, reset } = methods;

  React.useEffect(() => {
    const subscription = watch(({ nodes }, { name, type }) => {
      console.log('watch', name, nodes, type);
      if (!name || !nodes) return;
      const namepath = name.split('.');
      if (namepath.length === 0) {
        const [target] = namepath;
        if (target === 'nodes') {
          // nodeの追加、削除
          // isReaf-isRootの設定
        }
      } else {
        // node 内の修正
        const [, index, target] = namepath;

        console.log('nodes(index)[target]', nodes[+index]);
        if (target === 'approvers') {
          // orderNoの採番
        } else if (target === 'operator') {
          //
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const { withProgress } = useProgress();
  const { setAlert } = useAlert();

  const onSubmit = handleSubmit(async (data) => {
    const nodes = data.nodes.map((node, index) => {
      node.nodeLv = index + 1;
      node.isReaf = index + 1 === data.nodes.length;
      node.approvers.forEach((approver, i) => approver.orderNo = i+1);
      return node;
    });

    await withProgress(async () => {
      const res = await syncNodes(workflowId, { nodes });
      console.log('res', res);
      return res;
    });
  }, (errors, event) => {
    setAlert({ open: true, alert: "Validation Error" });
    console.log('handleSubmit:errors', errors);
    console.log('handleSubmit:event', event);
  });

  const hasRendered = React.useRef(false);
  React.useEffect(() => {
    if (hasRendered.current) {
      // server side actionはdata取得を前提としていないとのこと
      console.warn('reset nodes data:', nodes);
      reset({ nodes });
    }
    hasRendered.current = true;
  }, [nodes, reset]);

  return (
    <FormProvider {...methods}>
      <form className='flex flex-col gap-4' onSubmit={onSubmit}>
        {children}
        <button type='submit'>submit</button>
      </form>
    </FormProvider>
  );
}

export const useNodeFieldArray = () => {
  const { control } = useFormContext<WorkflowNodeForm>();
  return useFieldArray<WorkflowNodeForm, FieldArrayPath<WorkflowNodeForm>, 'uid'>({
    control,
    name: 'nodes',
    keyName: 'uid', // NOTE: This prop is no longer required and will be removed in the next major version.
  });
};

export const useApproverFieldArray = (index: number) => {
  const { control } = useFormContext<WorkflowNodeForm>();

  return useFieldArray<WorkflowNodeForm, FieldArrayPath<WorkflowNodeForm>, 'uid'>({
    control,
    name: `nodes.${index}.approvers` as const,
    keyName: 'uid',
    rules: { required: { value: true, message: "approverは必須です" } },
  });
};
