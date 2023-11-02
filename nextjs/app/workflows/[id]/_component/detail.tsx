'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Workflow, User as UserModel } from '@models';
import Button, { buttonClasses } from '@mui/material/Button';
import Card, { cardClasses } from '@mui/material/Card';
import { Chip, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import { Operators } from 'types/enum';

import Approver from './approver';
import NodeActionButton from './node-action';
import { useUserDialog, DialogFormType } from './selector';

const jointLineSize = '2.2rem';
const NodeRoot = styled('div')({
  display: 'flex',
  '&:first-child': {
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
  '&:last-child': {
    '.node.joint::before': {
      display: 'none',
    },
  },
});

type Props = {
  data: Workflow;
  users: User[];
  deleteWorkflow: () => void;
  addNode: () => void;
};

type Node = {
  id?: number;
  uid: number | string;
  nodeLv: number;
  operator: Operator;
  isRoot?: boolean;
  isReaf?: boolean;
  approvers: Approver[];
  childNode?: Node;
};
type Approver = {
  id?: number;
  uid: number | string;
  orderNo: number;
  approver: User;
};
type User = Required<Pick<UserModel, 'id' | 'nickname'>>;

const demoData: Node[] = [
  {
    id: 1,
    uid: 1,
    nodeLv: 1,
    operator: Operators.Or,
    isRoot: true,
    approvers: [
      {
        id: 101,
        uid: 101,
        orderNo: 1,
        approver: { nickname: 'Jack', id: 1 },
      },
      {
        id: 102,
        uid: 102,
        orderNo: 2,
        approver: { nickname: 'Bob', id: 2 },
      },
    ],
  },
  {
    id: 2,
    uid: 2,
    nodeLv: 2,
    operator: Operators.And,
    isReaf: true,
    approvers: [
      {
        id: 103,
        uid: 103,
        orderNo: 1,
        approver: { nickname: 'Jesse', id: 4 },
      },
    ],
  },
];

const WorkflowDetail: React.FC<Props> = ({ data, users }) => {
  console.log('data', data);

  const [nodes, setNodes] = React.useState<Node[]>(demoData);

  const onNodeAddClick = (beforeIndex: number) => {
    setNodes((state) => {
      const uid = Date.now();
      const isReaf = beforeIndex >= state.length - 1;
      const newNode: Node = {
        uid,
        nodeLv: beforeIndex + 1,
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
    setNodes((state) => state.filter((_, index) => index !== targetIndex));
  };

  return (
    <>
      {nodes.map((node, index) => (
        <Node
          key={node.uid}
          data={node}
          users={users}
          onNodeAddClick={() => onNodeAddClick(index)}
          onNodeDeleteClick={
            nodes.length <= 1 ? undefined : () => onNodeDeleteClick(index)
          }
        />
      ))}
    </>
  );
};

export default WorkflowDetail;

export type NodeProps = {
  data: Node;
  onNodeAddClick?: React.MouseEventHandler<HTMLButtonElement>; //(beforeNodeId: number) => void;
  onSelectorClick?: (nodeId: number) => void;
  onNodeDeleteClick?: () => void;
} & Pick<Props, 'users'>;

const Node: React.FC<NodeProps> = (props) => {
  //const { id, onNodeAddClick, onSelectorClick } = props;
  const { data, users, onNodeAddClick, onNodeDeleteClick } = props;

  const [approvers, setApprovers] = React.useState<Approver[]>(data.approvers);

  /**
   * user selector
   */
  const userMethods = useForm<DialogFormType>();
  const { watch: userWatch, reset } = userMethods;
  React.useEffect(() => {
    const subscription = userWatch(({ user }, { name }) => {
      console.log(name, user);
      if (name !== 'user' || !user) return;

      setApprovers((state) => {
        const newId = Date.now();
        const newApprover: Approver = {
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

  const selectableUsers = React.useMemo(
    () =>
      users.filter((user) =>
        approvers.every((item) => item.approver.id !== user.id)
      ),
    [approvers, users]
  );
  const [userDialog, setDialogOpen] = useUserDialog(selectableUsers);

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

  React.useEffect(() => console.log('applovers', approvers), [approvers]);

  const ope = 'AND';
  return (
    <NodeRoot>
      <FormProvider {...userMethods}>{userDialog}</FormProvider>
      <div className='node'>
        <Card>
          <Stack spacing={1}>
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
          disabled={approvers.length === 0}
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
