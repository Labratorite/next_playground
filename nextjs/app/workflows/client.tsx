'use client';

import NextError from 'next/error';
import React from 'react';
import axios from 'axios';
import { Workflow } from '@models';
import { Stack } from '@mui/material';
import WorkflowList, { WorkflowRow } from './list';
import { ResponseData as StoreResponse } from './api/route';
import { ResponseData } from './api/[id]/route';

export type ValidProps = {
  workflows: Workflow[];
  type: 'Success';
};
export type InvalidProps = {
  message: string;
  errorCode: number;
  type: 'Failure';
};
export type Props = ValidProps | InvalidProps;

const ClientPage: React.FC<Props> = (props) => {
  if (props.type === 'Failure') {
    return <NextError statusCode={props.errorCode} />;
  }
  return <Page {...props} />;
};

export default ClientPage;

const Page: React.FC<ValidProps> = (props) => {
  const { workflows } = props;
  const [rows, setRows] = React.useState<WorkflowRow[]>(
    workflows.map((item) => ({ ...item, rowId: item.id }))
  );
  React.useEffect(() => {
    setRows(workflows?.map((item) => ({ ...item, rowId: item.id })));
  }, [workflows]);

  const removeRow = React.useCallback(
    async (rowId: string | number, editCanceled: boolean) => {
      if (!editCanceled) {
        await deleteWorkflow(rowId);
      }

      setRows((rows) =>
        rows.filter((row) => !row.isNew || row.rowId !== rowId)
      );
    },
    []
  );

  const addRow = (newId: string | number) => {
    setRows((oldRows) => [
      ...oldRows,
      { rowId: newId, name: '', description: '', publish: false, isNew: true },
    ]);
  };

  const saveRow = React.useCallback(async (newRow: WorkflowRow) => {
    // Server api
    //setRows((rows) => rows.map((row) => (row.rowId === newRow.rowId ? { ...newRow, isNew: false } : row)));
    const { isNew, rowId, ...data } = newRow;
    //const updatedRow = { ...newRow, isNew: false };

    let model = { ...data, rowId };
    // error は handleProcessRowUpdateError で処理
    if (isNew) {
      const stored = await storeWorkflow(data);
      model = { ...stored, rowId: stored.id };
    } else {
      await updateWorkflow(data);
    }
    setRows((rows) =>
      rows.map((row) => (row.rowId === rowId ? model : row))
    );

    return model;
  }, []);

  const storeWorkflow = async (workflow: Partial<Workflow>) => {
    //const res = await axios.post<StoreResponse>('/api/workflow', { workflow });
    const res = await axios.post<StoreResponse>('/workflows/api', { workflow });
    console.log('res', res);
    return res.data.workflow;
  };
  const updateWorkflow = async (workflow: Partial<Workflow>) => {
    //`/api/workflow/${workflow.id}`,
    const res = await axios.patch<ResponseData>(
      `/workflows/api/${workflow.id}`,
      { workflow }
    );
    console.log(res);
  };

  const deleteWorkflow = async (rowId: string | number) => {
    const res = await axios.delete(`/api/workflow/${rowId}`);
    console.log(res);
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
