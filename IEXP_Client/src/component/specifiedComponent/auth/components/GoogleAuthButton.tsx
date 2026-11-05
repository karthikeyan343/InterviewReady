import React from "react";
import { Box } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useLocation } from "react-router-dom";

interface GoogleAuthButtonProps {
  onSuccess: (credential: string) => void;
  onError: () => void;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onSuccess,
  onError,
  text = "continue_with",
}) => {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",

        "& > div": {
          width: "100%",
        },

        "& iframe": {
          maxWidth: "100% !important",
        },

        "@media (max-width: 599.95px)": {
          overflow: "hidden",
        },
      }}
    >
      <GoogleLogin
        key={location.key}
        onSuccess={(credentialResponse) => {
          if (!credentialResponse.credential) {
            onError();
            return;
          }
          onSuccess(credentialResponse.credential);
        }}
        onError={onError}
        theme="outline"
        size="large"
        shape="rectangular"
        text={text}
        width="100%"
      />
    </Box>
  );
};
