'use client';

import React from 'react';
import Backdrop, { BackdropProps } from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export const Progress: React.FC<BackdropProps> = (props) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      {...props}
    >
      <CircularProgress color='inherit' />
    </Backdrop>
  );
};

type ProgressContextType = {
  setProgress: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  withProgress: <T extends unknown>(callback: () => Promise<T>) => Promise<T | void>;
};
export const ProgressContext = React.createContext<ProgressContextType | null>(null);
export const useProgress = () => {
  const context = React.useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be within ProgressContext');
  return context;
};

type Props = {
  children: React.ReactNode;
};
export default function ProgressProvider({ children }: Props) {
  const [open, setOpen] = React.useState(false);

  const contextValue = React.useMemo<ProgressContextType>(
    () => ({
      setProgress: setOpen,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
      withProgress: async <T extends unknown>(callback: () => Promise<T>) => {
        setOpen(true);
        try {
          return await callback();
        } finally {
          setOpen(false);
        }
      },
    }),
    []
  );

  return (
    <>
      <Progress open={open} />
      <ProgressContext.Provider value={contextValue}>{children}</ProgressContext.Provider>
    </>
  );
}
