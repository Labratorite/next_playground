'use client';

import React from 'react';
import { animateScroll as scroller } from 'react-scroll';
import { Controller, useFormContext, useFormState } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Collapse,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import clsx from 'clsx';
import { TransitionGroup } from 'react-transition-group';
import { Operators } from 'types/enum';
import type { UserAttributes } from '@models/user.model';
import type { Approver, Node, WorkflowNodeForm } from './form';
import { useNodeFieldArray, useApproverFieldArray } from './form';
import ApproverCard from './approver';
import NodeActionButton from './node-action';
import { useUserDialog } from './selector';
import { NodeRoot } from './node.styled';
import InvalidTypography from 'components/invalid-typography';

type Props = {
  workflowId: number;
  users: UserAttributes[];
  deleteNode?: () => void;
  addNode?: () => void;
  update?: () => void;
};

const WorkflowDetail: React.FC<Props> = ({ workflowId, users }) => {
  const { fields, remove, insert } = useNodeFieldArray();

  const onNodeAddClick = (beforeIndex: number) => {
    const insertIndex = beforeIndex + 1;
    const isReaf = insertIndex > fields.length - 1;
    const newNode: Node = {
      workflowId,
      nodeLv: insertIndex + 1,
      operator: null,
      isReaf,
      approvers: [],
    };
    insert(insertIndex, newNode);
    // todo?: update nodeLv/isReaf/isRoot?
  };

  const onNodeDeleteClick = (targetIndex: number) => {
    // todo?: update nodeLv/isReaf/isRoot?
    remove(targetIndex);
  };

  return (
    <>
      <TransitionGroup
        component={CardContent}
        id='scrollContainer'
        sx={{ display: 'flex', overflowX: 'auto', pb: '3rem' }}
      >
        {fields.map((field, index) => (
          <Collapse key={field.uid} orientation='horizontal' sx={{ flexShrink: 0 }}>
            <Node
              formIndex={index}
              workflowId={workflowId}
              isReaf={fields.length - 1 === index}
              users={users}
              onNodeAddClick={() => onNodeAddClick(index)}
              onNodeDeleteClick={
                fields.length <= 1 ? undefined : () => onNodeDeleteClick(index)
              }
            />
          </Collapse>
        ))}
      </TransitionGroup>
    </>
  );
};

export default WorkflowDetail;

const useSelectableUser = (users: UserAttributes[], formIndex: number) => {
  const { watch } = useFormContext<WorkflowNodeForm>();
  const approvers = watch(`nodes.${formIndex}.approvers`);
  return React.useMemo(
    () => users.filter((user) => approvers.every((item) => item.approver.id !== user.id)),
    [approvers, users]
  );
};

export type NodeProps = {
  formIndex: number;
  workflowId: number;
  isReaf: boolean;
  onNodeAddClick?: React.MouseEventHandler<HTMLButtonElement>; //(beforeNodeId: number) => void;
  onNodeDeleteClick?: () => void;
} & Pick<Props, 'users'>;

const Node: React.FC<NodeProps> = (props) => {
  const APPROVER_MAX_COUNT = 3;
  const { formIndex, workflowId, isReaf, users, onNodeAddClick, onNodeDeleteClick } = props;

  const { control } = useFormContext<WorkflowNodeForm>();

  const { fields, append, remove } = useApproverFieldArray(formIndex);

  /**
   * user selector
   */
  const selectableUsers = useSelectableUser(users, formIndex);
  const [userDialog, setDialogOpen, dialogMethods] = useUserDialog(selectableUsers);
  const { watch: userWatch, reset } = dialogMethods;

  React.useEffect(() => {
    const subscription = userWatch(({ user }, { name }) => {
      if (name !== 'user' || !user) return;
      const newApprover: Approver = {
        workflowId,
        orderNo: fields.length + 1,
        approverId: user.id!,
        approver: {
          id: user.id!,
          nickname: user.nickname || '',
        },
      };
      append(newApprover);
      reset();
    });
    return () => subscription.unsubscribe();
  }, [workflowId, fields, append, userWatch, reset]);

  const onPersonAddClick = React.useMemo(() => {
    if (fields.length < APPROVER_MAX_COUNT) {
      return () => setDialogOpen(true);
    }
  }, [fields.length, setDialogOpen]);

  const handleRemoveClick = (removeIndex: number) => {
    remove(removeIndex);
  };

  React.useLayoutEffect(
    () => scroller.scrollTo(1000, { horizontal: true, containerId: 'scrollContainer' }),
    []
  );

  return (
    <NodeRoot className={clsx({ root: formIndex === 0, reaf: isReaf })}>
      {userDialog}
      <div className='node'>
        <Card>
          <Stack spacing={2}>
            <Operator formIndex={formIndex} disabled={fields.length <= 1} />
            {fields.map((field, index) => {
              return (
                <React.Fragment key={field.uid}>
                  {index !== 0 && <OperatorChip formIndex={formIndex} />}
                  <Controller
                    name={`nodes.${formIndex}.approvers.${index}.approver`}
                    control={control}
                    render={({ field: { value } }) => (
                      <ApproverCard
                        nickname={value.nickname}
                        onRemoveClick={() => handleRemoveClick(index)}
                      />
                    )}
                  />
                </React.Fragment>
              );
            })}

            <NodeActionButton
              onPersonAddClick={onPersonAddClick}
              onNodeDeleteClick={onNodeDeleteClick}
            />
            {/*
            <Button
              variant='outlined'
              aria-label='add-approver'
              onClick={onPersonAddClick}
              disabled={approvers.length >= 3}
            >
              <PersonAddIcon />
            </Button>
            */}
          </Stack>
        </Card>
        <ApproversInvalidMessage formIndex={formIndex} />
      </div>
      <div className='node joint'>
        <Button
          variant='outlined'
          onClick={onNodeAddClick}
          disabled={fields.length === 0 && isReaf}
        >
          <AddIcon fontSize='large' />
        </Button>
      </div>
    </NodeRoot>
  );
};

const ApproversInvalidMessage: React.FC<{ formIndex: number }> = ({ formIndex }) => {
  const { control } = useFormContext<WorkflowNodeForm>();
  const { errors } = useFormState({ control });
  return (
    <ErrorMessage
      errors={errors}
      name={`nodes.${formIndex}.approvers.root`}
      render={({ message }) => <InvalidTypography value={ message } style={{ marginTop: '0.5em'}}/>}
    />
  );
};

type OperatorProps = {
  disabled?: boolean;
  formIndex: number;
};
const Operator: React.FC<OperatorProps> = ({ disabled, formIndex }) => {
  const { control, setValue } = useFormContext<WorkflowNodeForm>();
  const isDisabled = React.useRef(disabled);

  React.useEffect(() => {
    if (isDisabled.current !== disabled) {
      setValue(`nodes.${formIndex}.operator`, disabled ? null : Operators.And);
      isDisabled.current = disabled;
    }
  }, [disabled, setValue, formIndex]);

  return (
    <Controller
      name={`nodes.${formIndex}.operator`}
      disabled={disabled}
      control={control}
      render={({ field }) => (
        <ToggleButtonGroup
          {...field}
          value={field.value}
          exclusive
          size='small'
          aria-label='text alignment'
          color={field.value === Operators.And ? 'info' : 'secondary'}
          fullWidth
        >
          <ToggleButton value='and' aria-label='left aligned' fullWidth>
            AND
          </ToggleButton>
          <ToggleButton value='or' aria-label='right aligned' fullWidth>
            OR
          </ToggleButton>
        </ToggleButtonGroup>
      )}
    />
  );
};

const OperatorChip: React.FC<{ formIndex: number }> = ({ formIndex }) => {
  const { watch } = useFormContext<WorkflowNodeForm>();
  const value = watch(`nodes.${formIndex}.operator`);
  return (
    <Chip
      size='small'
      label={value?.toUpperCase()}
      color={(!value && 'default') || value === Operators.And ? 'info' : 'secondary'}
    />
  );
};
