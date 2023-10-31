'use client';

import React from 'react';
import Link from 'next/link';
//import { useFormContext } from "react-hook-form";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowId,
  GridColDef,
  GridActionsColDef,
  GridRowModes,
  GridRowModesModel,
  GridToolbarContainer,
  GridRowEditStopReasons,
  GridEventListener,
  useGridApiRef,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

import { Workflow } from 'db/models';
import { Button } from '@mui/material';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  {
    field: 'name',
    headerName: 'Workflow Name',
    width: 130,
    editable: true,
    renderCell: (params) => (
      <Link href={`/workflows/${params.id}`}>{params.value}</Link>
    ),
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 200,
    editable: true,
  },
];

enum Actions {
  Add = 'add',
  Edit = 'edit',
  Delete = 'delete',
  Save = 'save',
  Cancel = 'cancel',
}
type ActionClickParams = { rowId: GridRowId; actionType: Actions };
type ActionClick = (actionState: ActionClickParams) => Promise<void>;

const generateActions = (
  isInEditMode: boolean,
  rowId: GridRowId,
  onActionClick: ActionClick
): ReturnType<GridActionsColDef['getActions']> => {
  if (isInEditMode) {
    return [
      <GridActionsCellItem
        icon={<SaveIcon />}
        label='Save'
        sx={{
          color: 'primary.main',
        }}
        onClick={() => onActionClick({ rowId, actionType: Actions.Save })}
        key={rowId}
      />,
      <GridActionsCellItem
        icon={<CancelIcon />}
        label='Cancel'
        className='textPrimary'
        onClick={() => onActionClick({ rowId, actionType: Actions.Cancel })}
        color='inherit'
        key={rowId}
      />,
    ];
  }

  return [
    <GridActionsCellItem
      icon={<EditIcon />}
      label='Edit'
      className='textPrimary'
      onClick={() => onActionClick({ rowId, actionType: Actions.Edit })}
      color='inherit'
      key={rowId}
    />,
    <GridActionsCellItem
      icon={<DeleteIcon />}
      label='Delete'
      onClick={() => onActionClick({ rowId, actionType: Actions.Delete })}
      color='inherit'
      key={rowId}
    />,
  ];
};

const Toolbar: React.FC<{ onAddClick: () => void }> = (props) => {
  const { onAddClick } = props;

  return (
    <GridToolbarContainer>
      <Button color='primary' startIcon={<AddIcon />} onClick={onAddClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
};

export type WorkflowRow = Partial<Workflow> & {
  isNew?: boolean;
  rowId: string | number;
};

type Props = {
  workflows: WorkflowRow[];
  removeRow: (rowId: string | number, editCanceled: boolean) => Promise<void>;
  addRow: (rowId: string | number) => void;
  saveRow: (
    newRow: WorkflowRow,
    oldRow: WorkflowRow
  ) => Promise<WorkflowRow> | WorkflowRow;
};
const WorkflowTable: React.FC<Props> = ({
  workflows,
  removeRow,
  addRow,
  saveRow,
}) => {

  const apiRef = useGridApiRef();

  //const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [rowModesModel, dispatchRowModesModel] = React.useReducer<
    React.Reducer<
      GridRowModesModel,
      { actionParams?: ActionClickParams; newState?: GridRowModesModel }
    >
  >((prevState, params) => {
    const { actionParams, newState } = params;
    if (newState) return newState;
    if (!actionParams) return prevState;

    const { rowId, actionType } = actionParams;
    switch (actionType) {
      case Actions.Add:
        return {
          ...prevState,
          [rowId]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        };
      case Actions.Edit:
        return { ...prevState, [rowId]: { mode: GridRowModes.Edit } };
      case Actions.Save:
        return { ...prevState, [rowId]: { mode: GridRowModes.View } };
      case Actions.Cancel:
        return {
          ...prevState,
          [rowId]: { mode: GridRowModes.View, ignoreModifications: true },
        };
      case Actions.Delete:
        return prevState;
      default:
        return prevState;
    }
  }, {});

  /**
   * Actionボタンハンドラー
   */
  const handleActionClick = React.useCallback(
    async (actionParams: ActionClickParams) => {
      const { actionType, rowId } = actionParams;

      if (actionType === Actions.Cancel || actionType === Actions.Delete) {
        await removeRow(rowId, actionType === Actions.Cancel);
      }

      dispatchRowModesModel({ actionParams });
    },
    [removeRow]
  );

  /**
   * 列定義
   */
  const columnDef = React.useMemo<GridColDef[]>(() => {
    return [
      ...columns,
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          return generateActions(isInEditMode, id, handleActionClick);
        },
      },
    ];
  }, [rowModesModel, handleActionClick]);

  const handleAddClick = () => {
    const rowId = Date.now(); //crypto.randomUUID();

    addRow(rowId);
    dispatchRowModesModel({ actionParams: { rowId, actionType: Actions.Add } });

    //apiRef.current.setPage(Math.floor(workflows.length / 5));
  };

  /**
   * When the user performs an action to stop editing, the processRowUpdate callback is triggered.
   * @param newRow
   * @param oldRow
   * @returns
   */
  const processRowUpdate = React.useCallback(
    async (newRow: WorkflowRow, oldRow: WorkflowRow) => {
      //const { isNew, ...baseModel} = newRow;
      //setRows((rows) => rows.map((row) => (row.rowId === newRow.rowId ? baseModel : row)));
      //return baseModel;
      if (!newRow.name) return oldRow;
      return await saveRow(newRow, oldRow);
    },
    [saveRow]
  );

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    console.error('handleProcessRowUpdateError', error);
  }, []);

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    dispatchRowModesModel({ newState: newRowModesModel });
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 5,
    page: 0,
  });

  return (
    <>
      <div style={{ height: 277, width: '100%' }}>
        <DataGrid
          apiRef={apiRef}
          rows={workflows}
          columns={columnDef}
          density='compact'
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          slots={{
            toolbar: Toolbar,
          }}
          slotProps={{
            toolbar: { onAddClick: handleAddClick },
          }}
          getRowId={(row) => row.rowId}
        />
      </div>
    </>
  );
};

export default WorkflowTable;
