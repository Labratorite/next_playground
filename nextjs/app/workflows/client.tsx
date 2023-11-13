'use client';

import NextError from 'next/error';
import React from 'react';
import axios from 'axios';
import { Stack } from '@mui/material';
import WorkflowList, { WorkflowRow, isExistsWorkflow } from './list';
//import { ResponseData as StoreResponse } from './api/route';
import type { ResponseData } from './api/[id]/route';
import type {
  WorkflowAttributes,
  WorkflowCreationAttributes,
} from '@models/workflow.model';

export type ValidProps = {
  workflows: WorkflowAttributes[];
  type: 'Success';
};
export type InvalidProps = {
  message: string;
  errorCode: number;
  type: 'Failure';
};
export type ServerActions = {
  storeWorkflow: (attributes: WorkflowCreationAttributes) => Promise<WorkflowAttributes>;
};

export type Props = ValidProps | InvalidProps;

const ClientPage: React.FC<Props & ServerActions> = (props) => {
  if (props.type === 'Failure') {
    return <NextError statusCode={props.errorCode} />;
  }
  return <Page {...props} />;
};

export default ClientPage;

const Page: React.FC<ValidProps & ServerActions> = (props) => {
  const { workflows, storeWorkflow } = props;
  const [rows, setRows] = React.useState<WorkflowRow[]>(
    workflows.map((item) => ({ ...item, rowId: item.id }))
  );
  React.useEffect(() => {
    setRows(workflows?.map((item) => ({ ...item, rowId: item.id })));
  }, [workflows]);

  const removeRow = React.useCallback(
    async (rowId: string | number, canceled: boolean) => {
      if (canceled) {
        setRows((rows) => rows.filter((row) => row.id || row.rowId !== rowId));
      } else {
        await deleteWorkflow(rowId);
        setRows((rows) => rows.filter((row) => row.rowId !== rowId));
      }
    },
    []
  );

  const addRow = (newId: string | number) => {
    setRows((oldRows) => [
      ...oldRows,
      { rowId: newId, name: '', description: '', publish: false },
    ]);
  };

  const saveRow = React.useCallback(
    async (newRow: WorkflowRow) => {
      // Server api
      //setRows((rows) => rows.map((row) => (row.rowId === newRow.rowId ? { ...newRow, isNew: false } : row)));
      const { rowId, ...data } = newRow;
      //const updatedRow = { ...newRow, isNew: false };

      let model = { ...data, rowId };
      // error は handleProcessRowUpdateError で処理
      if (isExistsWorkflow(data)) {
        console.debug('isExistsWorkflow');
        await updateWorkflow(data);
      } else {
        const stored = await storeWorkflow(data);
        model = { ...stored, rowId: stored.id };
        console.debug('model', model);
      }
      setRows((rows) => rows.map((row) => (row.rowId === rowId ? model : row)));

      return model; // DataGridのprocessRowUpdateのために返却しているけど、server action にするならredirectにするのが正しいかもしれない
    },
    [storeWorkflow]
  );

  /*
  const storeWorkflow = async (workflow: Partial<Workflow>) => {
    //const res = await axios.post<StoreResponse>('/api/workflow', { workflow });
    const res = await axios.post<StoreResponse>('/workflows/api', { workflow });
    console.log('res', res);
    return res.data.workflow;
  };
  */
  const updateWorkflow = async (workflow: WorkflowAttributes) => {
    //`/api/workflow/${workflow.id}`,
    const res = await axios.patch<ResponseData>(`/workflows/api/${workflow.id}`, {
      workflow,
    });
    console.debug('updateWorkflow', res);
  };

  const deleteWorkflow = async (rowId: string | number) => {
    const res = await axios.delete(`/workflows/api/${rowId}`);
    console.debug('deleteWorkflow', res);
  };

  return (
    <>
      <h1>Workflows</h1>
      <Stack component='section' justifyContent='flex-end'>
        {rows && (
          <WorkflowList
            workflows={rows}
            addRow={addRow}
            removeRow={removeRow}
            saveRow={saveRow}
          />
        )}
      </Stack>
    </>
  );
};
