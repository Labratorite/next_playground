'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import {
  useForm,
  useFormContext,
  FormProvider,
  UseFormReturn,
} from 'react-hook-form';
import { TextField } from '@mui/material';
//import type { Userttributes } from '@models/user.model';

//const emails = ['username@gmail.com', 'user02@gmail.com'];
export type UserInfo = {
  id: number;
  nickname: string;
  image?: string;
};
export type DialogFormType = { user: UserInfo };

export type UserDialogProps = {
  open: boolean;
  //onOk: (value: string) => void;
  //onClose: () => void;
  users: UserInfo[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserDialog: React.FC<UserDialogProps> = (props) => {
  const { setOpen, open, users } = props;
  const { setValue } = useFormContext<DialogFormType>();

  const handleClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (value: UserInfo) => {
    setValue('user', value);
    setOpen(false);
  };

  const [filter, setFilter] = React.useState<string>();
  const filterChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setFilter(event.target.value);
  };
  const selectables = React.useMemo(
    () =>
      (filter && users.filter((item) => item.nickname.indexOf(filter) >= 0)) ||
      users,
    [users, filter]
  );
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      maxWidth='xs'
      sx={{ [` .${dialogClasses.paper}`]: { minHeight: '60vh' } }}
    >
      <DialogTitle>Set approver account</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem>
          <TextField
            label='nickname'
            value={filter}
            onChange={filterChange}
            fullWidth
            size='small'
          />
        </ListItem>
        {selectables.map((user) => (
          <ListItem disableGutters key={user.id}>
            <ListItemButton onClick={() => handleListItemClick(user)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.nickname} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default UserDialog;

type UserDialogReturn = [
  JSX.Element,
  React.Dispatch<React.SetStateAction<boolean>>,
  UseFormReturn<DialogFormType>,
];
export const useUserDialog = (users: UserInfo[]) => {
  const [open, setOpen] = React.useState(false);
  const userMethods = useForm<DialogFormType>();

  return React.useMemo<UserDialogReturn>(() => {
    return [
      <>
        <FormProvider {...userMethods}>
          <UserDialog open={open} setOpen={setOpen} users={users} />
        </FormProvider>
      </>,
      setOpen,
      userMethods,
    ];
  }, [open, users, userMethods]);
};
