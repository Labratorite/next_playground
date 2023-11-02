'use client';

import React from 'react';
import Button, { ButtonProps, buttonClasses } from '@mui/material/Button';
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
//import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/system';

const ActionGroup = styled(ButtonGroup)({
  [`.${buttonClasses.root}`]: {
    border: 0,
    '&:last-child': {
      minWidth: '3em',
      p: 0,
    },
    '&:not(:last-child)': {
      flex: 1,
    },
  },
});

type Action = 'ADD' | 'DELETE';

const options: Record<
  Action,
  {
    label: string;
    element: React.ReactNode;
    variant?: ButtonProps['variant'];
  }
> = {
  ADD: {
    label: 'ADD',
    element: <PersonAddIcon />,
    variant: 'outlined',
  },
  DELETE: {
    label: 'NODE DELETE',
    element: <DeleteSweepIcon />,
    variant: 'contained',
  },
};

type NodeActionButtonProps = {
  onPersonAddClick?: () => void;
  onNodeDeleteClick?: () => void;
};
const NodeActionButton: React.FC<NodeActionButtonProps> = ({
  onPersonAddClick,
  onNodeDeleteClick,
}) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<Action>('ADD');

  const hancleClick = React.useCallback(
    (selected: Action) => {
      if (selected === 'ADD') {
        if (onPersonAddClick) return () => onPersonAddClick();
      } else {
        if (onNodeDeleteClick) return () => onNodeDeleteClick();
      }
    },
    [onPersonAddClick, onNodeDeleteClick]
  );

  const enableDelete = !!onNodeDeleteClick;
  React.useEffect(() => {
    if (!enableDelete) {
      setOpen(false);
      setSelectedIndex('ADD');
    }
  }, [enableDelete]);

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: Action
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
      <ActionGroup
        variant='contained'
        ref={anchorRef}
        aria-label='split button'
        fullWidth
      >
        <Button
          variant={options[selectedIndex].variant}
          disabled={!hancleClick(selectedIndex)}
          onClick={hancleClick(selectedIndex)}
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
      </ActionGroup>
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
                  {Object.entries(options).map(([key, option]) => (
                    <MenuItem
                      key={key}
                      divider
                      disabled={!hancleClick(key as Action)}
                      selected={key === selectedIndex}
                      onClick={(event) =>
                        handleMenuItemClick(event, key as Action)
                      }
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

export default NodeActionButton;
