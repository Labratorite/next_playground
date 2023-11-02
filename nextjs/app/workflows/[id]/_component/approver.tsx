'use client';

import React from 'react';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material';
//import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

type ApproverProps = {
  nickname: string;
  onRemoveClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const Approver: React.FC<ApproverProps> = ({ nickname, onRemoveClick }) => {
  return (
    <Paper>
      <ListItem
        secondaryAction={
          <IconButton onClick={onRemoveClick} edge='end' aria-label='delete'>
            <HighlightOffIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar aria-label='approver' alt={nickname} />
        </ListItemAvatar>
        <ListItemText
          primary={nickname}
          primaryTypographyProps={{
            variant: 'subtitle2',
            style: {
              wordBreak: 'break-all',
              /*
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              */
            },
          }}
          secondary={null}
        />
      </ListItem>
    </Paper>
  );
};

export default Approver;
