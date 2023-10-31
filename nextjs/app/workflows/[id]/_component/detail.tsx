//'use client';
import React from 'react';
import { Workflow } from '@models';
import Button, { ButtonProps, buttonClasses } from '@mui/material/Button';
import Card, { cardClasses } from '@mui/material/Card';
import CardHeader, { cardHeaderClasses } from '@mui/material/CardHeader';
import {
  Avatar,
  Chip,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  ButtonGroup,
  ClickAwayListener,
  Grow,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
//import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/system';

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
    marginLeft: '2.2rem',

    position: 'relative',
    '&::before': {
      content: '""',
      width: '2.2rem',
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
  deleteWorkflow: () => void;
  addNode: () => void;
};

const WorkflowDetail: React.FC<Props> = ({ data }) => {
  console.log('data', data);
  const [list, setList] = React.useState<number[]>([1]);
  const onNodeAddClick = (beforeIndex: number) => {
    setList((state) => {
      if (beforeIndex >= state.length - 1) {
        return [...state, state.length + 1];
      }
      return [
        ...state.slice(0, beforeIndex + 1),
        state.length + 1,
        ...state.slice(beforeIndex),
      ];
    });
  };

  const onNodeDeleteClick = (targetIndex: number) => {
    setList((state) => state.filter((_, index) => index !== targetIndex));
  }

  return (
    <>
      {list.map((item, key) => (
        <Node key={key} id={item} onNodeAddClick={() => onNodeAddClick(key)} onNodeDeleteClick={(list.length <= 1) ? undefined : () => onNodeDeleteClick(key)} />
      ))}
    </>
  );
};

export default WorkflowDetail;

export type NodeProps = {
  id: number;
  onNodeAddClick?: React.MouseEventHandler<HTMLButtonElement>; //(beforeNodeId: number) => void;
  onSelectorClick?: (nodeId: number) => void;
  onNodeDeleteClick?: () => void;
};

const Node: React.FC<NodeProps> = (props) => {
  //const { id, onNodeAddClick, onSelectorClick } = props;
  const { onNodeAddClick, onNodeDeleteClick } = props;

  const [list, setList] = React.useState<number[]>([]);

  const onPersonAddClick = React.useMemo(() => {
    if (list.length < 3) {
      return () => setList((state) => [...state, state.length]);
    }
  }, [list.length]);
  const handleRemoveClick = (removeIndex: number) => {
    setList((state) => state.filter((_, index) => index !== removeIndex));
  };

  const ope = 'AND';
  return (
    <NodeRoot>
      <div className='node'>
        <Card>
          <Stack spacing={1}>
            <Operator disabled={list.length === 0} />
            {list.map((item, index) => {
              return (
                <>
                  <Approver
                    key={index}
                    nickname={'nickname' + item}
                    onRemoveClick={() => handleRemoveClick(index)}
                  />
                  {index !== list.length - 1 && (
                    <Chip size='small' label={ope} />
                  )}
                </>
              );
            })}

            <NodeActionButton onPersonAddClick={onPersonAddClick} onNodeDeleteClick={onNodeDeleteClick} />
            {/*
            <Button
              variant='outlined'
              aria-label='add-approver'
              onClick={onPersonAddClick}
              disabled={list.length >= 3}
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
          disabled={list.length === 0}
        >
          <AddIcon fontSize='large' />
        </Button>
      </div>
    </NodeRoot>
  );
};

const options: {
  label: string;
  element: React.ReactNode;
  variant?: ButtonProps['variant'];
}[] = [
  {
    label: 'ADD',
    element: <PersonAddIcon />,
    variant: 'outlined',
  },
  {
    label: 'NODE DELETE',
    element: <DeleteSweepIcon />,
    variant: 'contained',
  },
];

type NodeActionButtonProps = {
  onPersonAddClick?: () => void;
  onNodeDeleteClick?: () => void;
};
const NodeActionButton: React.FC<NodeActionButtonProps> = ({
  onPersonAddClick,
  onNodeDeleteClick,
}) => {
  /*
  const options: {
    label: string;
    element: React.ReactNode;
    variant?: ButtonProps['variant'];
    disabled?: ButtonProps['disabled'];
    onClick?: ButtonProps['onClick'];
  }[] = [
    {
      label: 'ADD',
      element: <PersonAddIcon />,
      variant: 'outlined',
      disabled: !onPersonAddClick,
      onClick: onPersonAddClick && (() => onPersonAddClick()),
    },
    {
      label: 'NODE DELETE',
      element: <DeleteSweepIcon />,
      variant: 'contained',
      disabled: !onNodeDeleteClick,
      onClick: onNodeDeleteClick && (() => onNodeDeleteClick()),
    },
  ];
  */
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const hancleClick = React.useCallback((selected: number) => {
    if (options[selected].label === 'ADD') {
      if (onPersonAddClick) return () => onPersonAddClick();
    } else {
      if (onNodeDeleteClick) return () => onNodeDeleteClick();
    }
  }, [onPersonAddClick, onNodeDeleteClick])

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        variant='text'
        ref={anchorRef}
        aria-label='split button'
        fullWidth
      >
        <Button
          variant={options[selectedIndex].variant}
          disabled={!hancleClick(selectedIndex)}
          onClick={hancleClick(selectedIndex)}
          sx={{ borderRight: '0px' }}
        >
          {options[selectedIndex].element}
        </Button>

        <Button
          size='small'
          variant={options[selectedIndex].variant}
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label='select merge strategy'
          aria-haspopup='menu'
          onClick={handleToggle}
          fullWidth={false}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
          paddingX: '1rem',
          width: '100%',
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id='split-button-menu' autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={index}
                      divider
                      disabled={!hancleClick(index)}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      <ListItemIcon>{option.element}</ListItemIcon>
                      <ListItemText>{option.label}</ListItemText>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

const ApproverCard = styled(CardHeader)({
  [`.${cardHeaderClasses.action}`]: {
    margin: 0,
  },
});

type ApproverProps = {
  nickname: string;
  onRemoveClick?: React.MouseEventHandler<HTMLButtonElement>;
};
const Approver: React.FC<ApproverProps> = ({ nickname, onRemoveClick }) => {
  return (
    <Card>
      <ApproverCard
        avatar={<Avatar aria-label='approver' alt={nickname} />}
        action={
          <IconButton
            aria-label='approver-delete'
            size='small'
            onClick={onRemoveClick}
          >
            <HighlightOffIcon />
          </IconButton>
        }
        title={nickname}
      />
    </Card>
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
