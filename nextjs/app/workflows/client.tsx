'use client';

import Error from 'next/error';
import React from 'react';
import axios from 'axios';
import { Workflow } from '@models';
import { Stack } from '@mui/material';
import WorkflowList, { WorkflowRow } from './list';
import { ResponseData } from '@api/workflow/index';

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
    return <Error statusCode={props.errorCode} />;
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
    [rows]
  );

  const addRow = (newId: string | number) => {
    setRows((oldRows) => [
      ...oldRows,
      { rowId: newId, name: '', description: '', publish: false, isNew: true },
    ]);
  };

  const updateRow = React.useCallback(async (newRow: WorkflowRow) => {
    // Server api
    //setRows((rows) => rows.map((row) => (row.rowId === newRow.rowId ? { ...newRow, isNew: false } : row)));
    const { isNew, rowId, ...data } = newRow;
    //const updatedRow = { ...newRow, isNew: false };

    let model = data;
    // error は handleProcessRowUpdateError で処理
    if (isNew) {
      model = await storeWorkflow(data);
    } else {
      await updateWorkflow(data);
    }
    setRows((rows) =>
      rows.map((row) => (row.rowId === rowId ? { ...model, rowId } : row))
    );

    return { ...model, rowId };
  }, []);

  const storeWorkflow = async (workflow: Partial<Workflow>) => {
    const res = await axios.post<ResponseData>('/api/workflow', { workflow });
    console.log('res', res);
    return res.data.workflow;
  };
  const updateWorkflow = async (workflow: Partial<Workflow>) => {
    const res = await axios.patch<ResponseData>(
      `/api/workflow/${workflow.id}`,
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
      <h1>TEST Post</h1>
      <Stack component='section' justifyContent='flex-end'>
        {rows && (
          <WorkflowList
            workflows={rows}
            addRow={addRow}
            removeRow={removeRow}
            updateRow={updateRow}
          />
        )}
      </Stack>
    </>
  );
};
