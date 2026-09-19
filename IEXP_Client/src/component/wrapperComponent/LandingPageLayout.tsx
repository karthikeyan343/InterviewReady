import type { ReactNode } from "react";
import { Box } from "@mui/material";

interface LandingPageLayoutProps {
  children: ReactNode;
}

const LandingPageLayout = ({ children }: LandingPageLayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        backgroundColor: "#fff",
      }}
    >
      {children}
    </Box>
  );
};

export default LandingPageLayout;