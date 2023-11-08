'use client';
import React from 'react';
import { FieldArrayPath, FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import type { Node, WorkflowNodeForm } from './index';

export { WorkflowNodeForm };

type Props = { children: React.ReactNode, nodes: Node[] }

export default function NodeForm(props: Props) {
  const { children, nodes } = props;

  const methods = useForm<WorkflowNodeForm>({ defaultValues: { nodes }});
  const { watch, reset } = methods;

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

      //reset();
    });
    return () => subscription.unsubscribe();
  }, [watch, reset]);

  return (
    <FormProvider {...methods}>
      { children}
    </FormProvider>
  )
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
    name: `nodes.${index}.approvers` as 'nodes.0.approvers',
    keyName: 'uid',
  });
};
