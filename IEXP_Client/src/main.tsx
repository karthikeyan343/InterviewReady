import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import "./index.css";
import { ServerWakeupProvider } from "./context/ServerWakeupContext";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient";

const theme = createTheme({
  typography: {
    fontFamily: '"Manrope", sans-serif',
  },
});

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ThemeProvider theme={theme}>
          <ServerWakeupProvider>
            <App />
          </ServerWakeupProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);