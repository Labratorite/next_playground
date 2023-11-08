'use client';

import { buttonClasses } from '@mui/material/Button';
import { cardClasses } from '@mui/material/Card';
import { styled } from '@mui/system';

const jointLineSize = '2.2rem';
export const NodeRoot = styled('div')({
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
