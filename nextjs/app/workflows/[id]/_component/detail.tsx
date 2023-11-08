'use client';

import React from 'react';
import { animateScroll as scroller } from 'react-scroll';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
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
import type { User as UserModel } from '@models';
import type { Approver, Node, WorkflowNodeForm } from './index';

import { useNodeFieldArray, useApproverFieldArray } from './form';
import ApproverCard from './approver';
import NodeActionButton from './node-action';
import { useUserDialog } from './selector';
import { NodeRoot } from './node.styled';

type Props = {
  users: ReadonlyModel<UserModel>[];
  deleteNode?: () => void;
  addNode?: () => void;
  update?: () => void;
};

const WorkflowDetail: React.FC<Props> = ({ users }) => {
  const { fields, remove, insert } = useNodeFieldArray();

  console.log('fields', fields);

  const onNodeAddClick = (beforeIndex: number) => {
    //const uid = Date.now();
    const insertIndex = beforeIndex + 1;
    const isReaf = insertIndex > fields.length - 1;
    const newNode: Node = {
      nodeLv: insertIndex + 1,
      operator: Operators.And,
      isReaf,
      approvers: [],
    };
    insert(insertIndex, newNode);
  };

  const onNodeDeleteClick = (targetIndex: number) => {
    // todo:
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

const useSelectableUser = (users: ReadonlyModel<UserModel>[], formIndex: number) => {
  const { control } = useFormContext<WorkflowNodeForm>();
  const approvers = useWatch({ control, name: `nodes.${formIndex}.approvers` });
  return React.useMemo(
    () => users.filter((user) => approvers.every((item) => item.approver.id !== user.id)),
    [approvers, users]
  );
};

export type NodeProps = {
  formIndex: number;
  isReaf: boolean;
  onNodeAddClick?: React.MouseEventHandler<HTMLButtonElement>; //(beforeNodeId: number) => void;
  onNodeDeleteClick?: () => void;
} & Pick<Props, 'users'>;

const Node: React.FC<NodeProps> = (props) => {
  const { formIndex, isReaf, users, onNodeAddClick, onNodeDeleteClick } = props;

  const { control } = useFormContext<WorkflowNodeForm>();

  const { fields, append, remove } = useApproverFieldArray(formIndex);

  /**
   * user selector
   */
  const selectableUsers = useSelectableUser(users, formIndex);
  const [userDialog, setDialogOpen, { watch: userWatch, reset }] =
    useUserDialog(selectableUsers);
  React.useEffect(() => {
    const subscription = userWatch(({ user }, { name }) => {
      console.log(name, user);
      if (name !== 'user' || !user) return;
      const newApprover: Approver = {
        orderNo: fields.length + 1,
        approver: {
          id: user.id,
          nickname: user.nickname || '',
        },
      };
      append(newApprover);

      reset();
    });
    return () => subscription.unsubscribe();
  }, [fields, append, userWatch, reset]);

  const onPersonAddClick = React.useMemo(() => {
    if (fields.length < 3) {
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
            <Operator formIndex={formIndex} disabled={fields.length === 0} />
            {fields.map((field, index) => {
              return (
                <React.Fragment key={field.uid}>
                  {index !== 0 && <OperatorChip formIndex={formIndex} />}
                  <Controller
                    name={`nodes.${formIndex}.approvers.${index}`}
                    control={control}
                    render={({ field: { value } }) => (
                      <ApproverCard
                        nickname={value.approver.nickname}
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

type OperatorProps = {
  disabled?: boolean;
  formIndex: number;
};
const Operator: React.FC<OperatorProps> = ({ disabled, formIndex }) => {
  const { control } = useFormContext<WorkflowNodeForm>();
  /*
  React.useEffect(() => {
    setValue(`nodes.${formIndex}.operator`, disabled ? null : Operators.And);
  }, [disabled]);
  */
  return (
    <Controller
      name={`nodes.${formIndex}.operator`}
      disabled={disabled}
      control={control}
      render={({ field }) => (
        <ToggleButtonGroup
          {...field}
          value={disabled ? null : field.value || Operators.And}
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
  console.log('operator value', value)
  return (
    <Chip
      size='small'
      label={value.toUpperCase()}
      color={value === Operators.And ? 'info' : 'secondary'}
    />
  );
};
