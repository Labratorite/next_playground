'use client';

import React from 'react';
import { animateScroll as scroller } from 'react-scroll';

import Button, { buttonClasses } from '@mui/material/Button';
import Card, { cardClasses } from '@mui/material/Card';
import {
  CardContent,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Collapse,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import clsx from 'clsx';
import { TransitionGroup } from 'react-transition-group';
import { Operators } from 'types/enum';
import { Workflow, User as UserModel } from '@models';
import * as self from './index';

import Approver from './approver';
import NodeActionButton from './node-action';
import { useUserDialog } from './selector';

const jointLineSize = '2.2rem';
const NodeRoot = styled('div')({
  display: 'flex',
  '&.root': {
    ' > div.node:first-child': {
      marginLeft: 0,
    },
  },
  ' > div.node': {
    maxWidth: '15em',
    '&:not(.joint)': {
      width: '15em',
    },
    marginLeft: jointLineSize,

    position: 'relative',
    '&::before': {
      content: '""',
      width: jointLineSize,
      display: 'block',
      position: 'absolute',
      top: '30px',
      left: '100%',
      borderTop: '2px solid #4999a5',
    },

    [` > .${cardClasses.root}`]: {
      padding: '1em',
    },
    [`&.joint > .${buttonClasses.root}`]: {
      marginTop: '15px',
    },
  },
  '&.reaf': {
    '.node.joint::before': {
      display: 'none',
    },
  },
});

type Props = {
  data: Workflow;
  users: ReadonlyModel<UserModel>[];
  deleteWorkflow: () => void;
  addNode: () => void;
};

const WorkflowDetail: React.FC<Props> = ({ users }) => {
  const [nodes, setNodes] = React.useState<self.Node[]>(self.demoData);

  const onNodeAddClick = (beforeIndex: number) => {
    setNodes((state) => {
      const uid = Date.now();
      const isReaf = beforeIndex >= state.length - 1;
      const newNode: self.Node = {
        uid,
        nodeLv: beforeIndex + 2,
        operator: Operators.And,
        isReaf,
        approvers: [],
      };

      if (isReaf) {
        state[state.length - 1].isReaf = false;
        return [...state, newNode];
      }

      const afterNodes = state.slice(beforeIndex + 1);
      return [
        ...state.slice(0, beforeIndex + 1),
        newNode,
        ...afterNodes.map((node) => ({ ...node, nodeLv: node.nodeLv })),
      ];
    });
  };

  const onNodeDeleteClick = (targetIndex: number) => {
    setNodes((state) => {
      const newNodes = state.filter((_, index) => index !== targetIndex);
      if (targetIndex === 0) newNodes[0].isRoot = true;
      if (targetIndex > newNodes.length - 1) newNodes[newNodes.length - 1].isReaf = true;
      return newNodes;
    });
  };

  return (
    <>
      <TransitionGroup
        component={CardContent}
        id="scrollContainer"
        sx={{ display: 'flex',  overflowX: 'auto', pb: '3rem' }}
      >
        {nodes.map((node, index) => (
          <Collapse key={node.uid} orientation='horizontal' sx={{ flexShrink: 0 }}>
            <Node
              data={node}
              users={users}
              onNodeAddClick={() => onNodeAddClick(index)}
              onNodeDeleteClick={
                nodes.length <= 1 ? undefined : () => onNodeDeleteClick(index)
              }
            />
          </Collapse>
        ))}
      </TransitionGroup>
    </>
  );
};

export default WorkflowDetail;

export type NodeProps = {
  data: self.Node;
  onNodeAddClick?: React.MouseEventHandler<HTMLButtonElement>; //(beforeNodeId: number) => void;
  onNodeDeleteClick?: () => void;
} & Pick<Props, 'users'>;

const Node: React.FC<NodeProps> = (props) => {
  const { data, users, onNodeAddClick, onNodeDeleteClick } = props;

  const [approvers, setApprovers] = React.useState<self.Approver[]>(data.approvers);

  /**
   * user selector
   */
  const selectableUsers = React.useMemo(
    () =>
      users.filter((user) =>
        approvers.every((item) => item.approver.id !== user.id)
      ),
    [approvers, users]
  );
  const [userDialog, setDialogOpen, userMethods] = useUserDialog(selectableUsers);
  const { watch: userWatch, reset } = userMethods;
  React.useEffect(() => {
    const subscription = userWatch(({ user }, { name }) => {
      console.log(name, user);
      if (name !== 'user' || !user) return;

      setApprovers((state) => {
        const newId = Date.now();
        const newApprover: self.Approver = {
          uid: 'app' + newId,
          orderNo: state.length + 1,
          approver: {
            id: user.id || newId, // dummy
            nickname: user.nickname || 'dummy ' + newId,
          },
        };
        return [...state, newApprover];
      });
      reset();
    });
    return () => subscription.unsubscribe();
  }, [userWatch, reset]);

  const onPersonAddClick = React.useMemo(() => {
    if (approvers.length < 3) {
      return () => setDialogOpen(true);
    }
  }, [approvers.length, setDialogOpen]);

  const handleRemoveClick = (removeIndex: number) => {
    setApprovers((state) => {
      return state
        .map((item, index) => {
          if (index === removeIndex) {
            item.orderNo = 0;
          } else if (index > removeIndex) {
            item.orderNo = index;
          }
          return item;
        })
        .filter((approver) => approver.orderNo > 0);
    });
  };

  React.useLayoutEffect(() => scroller.scrollTo(1000, { horizontal: true, containerId: 'scrollContainer' }), []);

  const ope = 'AND';
  return (
    <NodeRoot className={clsx({ root: data.isRoot, reaf: data.isReaf })}>
      {userDialog}
      <div className='node'>
        <Card>
          <Stack spacing={2}>
            <Operator disabled={approvers.length === 0} />
            {approvers.map((approver, index) => {
              return (
                <React.Fragment key={approver.uid}>
                  <Approver
                    nickname={approver.approver.nickname}
                    onRemoveClick={() => handleRemoveClick(index)}
                  />
                  {index !== approvers.length - 1 && (
                    <Chip size='small' label={ope} />
                  )}
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
          disabled={approvers.length === 0 && data.isReaf}
        >
          <AddIcon fontSize='large' />
        </Button>
      </div>
    </NodeRoot>
  );
};

type OperatorProps = {
  disabled?: boolean;
};
const Operator: React.FC<OperatorProps> = ({ disabled }) => {
  const [value, setValue] = React.useState<Operator | null>(null);

  React.useEffect(() => {
    setValue(disabled ? null : 'and');
  }, [disabled]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: Operator
  ) => {
    setValue(newValue);
  };
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      size='small'
      aria-label='text alignment'
      color='secondary'
      fullWidth
      disabled={disabled}
    >
      <ToggleButton value='and' aria-label='left aligned' fullWidth>
        AND
      </ToggleButton>
      <ToggleButton value='or' aria-label='right aligned' fullWidth>
        OR
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
