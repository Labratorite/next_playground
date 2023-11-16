'use client';

import React from 'react';
import { Alert, AlertProps, Snackbar } from '@mui/material';

type SnackbarAlertProps = {
  open: boolean;
  onClose: () => void;
  alert?: React.ReactNode;
} & Pick<AlertProps, 'severity'>;

export function SnackbarAlert({ open, onClose, alert, severity }: SnackbarAlertProps) {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={ severity } sx={{ width: '100%' }}>
        {alert}
      </Alert>
    </Snackbar>
  );
}

type AlertState = {
  alert?: React.ReactNode;
  severity?: AlertProps['severity'];
}
type ClosedAlertState = UndefinedOf<AlertState>

type SnackbarAlertStateActionType = { open: true; } & AlertState | { open: false; } & ClosedAlertState;
type SnackbarAlertStateType = { open: boolean } & AlertState;

type SnackbarAlertContextType = {
  setAlert: React.Dispatch<SnackbarAlertStateActionType>;
};
export const SnackbarAlertTypeContext = React.createContext<SnackbarAlertContextType | null>(
  null
);

export const useAlert = () => {
  const context = React.useContext(SnackbarAlertTypeContext);
  if (!context) throw new Error('useAlert must be within SnackbarAlertTypeContext');
  return context;
};

export default function SnackbarAlertProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatchAlert] = React.useReducer<
    React.Reducer<SnackbarAlertStateType, SnackbarAlertStateActionType>
  >(
    (state, action) => {
      const { open, alert, severity } = action;
      if (open) {
        return { open, alert: alert || 'Error', severity: severity || 'warning' };
      } else {
        return { ...state, open };
      }
    },
    { open: false }
  );

  const handleClose = React.useCallback(() => dispatchAlert({ open: false }), []);
  const contextValue = React.useMemo<SnackbarAlertContextType>(
    () => ({
      setAlert: dispatchAlert,
    }),
    []
  );

  return (
    <>
      <SnackbarAlert {...state} onClose={handleClose} />
      <SnackbarAlertTypeContext.Provider value={contextValue}>
        {children}
      </SnackbarAlertTypeContext.Provider>
    </>
  );
}
