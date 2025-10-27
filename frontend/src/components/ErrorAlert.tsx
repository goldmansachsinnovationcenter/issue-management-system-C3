import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface ErrorAlertProps {
  error: string | null;
  onClose?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onClose }) => {
  if (!error) return null;
  
  return (
    <Alert severity="error" onClose={onClose} sx={{ mb: 2 }}>
      <AlertTitle>Error</AlertTitle>
      {error}
    </Alert>
  );
};
