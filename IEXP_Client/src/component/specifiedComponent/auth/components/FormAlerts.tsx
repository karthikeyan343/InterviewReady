import React from "react";
import { Alert } from "@mui/material";

interface FormAlertsProps {
  error: string;
  success?: string;
  onClearError: () => void;
}

export const FormAlerts: React.FC<FormAlertsProps> = ({
  error,
  success,
  onClearError,
}) => {
  return (
    <>
      {error && (
        <Alert
          severity="error"
          onClose={onClearError}
          sx={{
            mb: "12px",
            py: 0,
            borderRadius: "6px",
            fontFamily: '"Manrope", sans-serif',
            fontSize: "11px",

            "& .MuiAlert-message": {
              fontSize: "11px",
            },

            "& .MuiAlert-icon": {
              fontSize: "17px",
            },
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{
            mb: "12px",
            py: 0,
            borderRadius: "6px",
            fontFamily: '"Manrope", sans-serif',

            "& .MuiAlert-message": {
              fontSize: "11px",
            },

            "& .MuiAlert-icon": {
              fontSize: "17px",
            },
          }}
        >
          {success}
        </Alert>
      )}
    </>
  );
};
