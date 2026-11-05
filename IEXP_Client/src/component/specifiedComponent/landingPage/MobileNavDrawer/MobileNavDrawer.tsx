import React from "react";
import { Box, Drawer } from "@mui/material";
import LandingDrawerHeader from "./components/LandingDrawerHeader";
import LandingDrawerNavItems from "./components/LandingDrawerNavItems";
import LandingDrawerAuthSection from "./components/LandingDrawerAuthSection";
import LandingDrawerFooter from "./components/LandingDrawerFooter";

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  activeSection: string;
  onNavClick: (href: string) => void;
  onAuthNav: (destination: string) => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  open,
  onClose,
  activeSection,
  onNavClick,
  onAuthNav,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      aria-label="Mobile navigation drawer"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(8, 25, 77, 0.45)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            transition: "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important",
          },
        },
        paper: {
          sx: {
            width: {
              xs: "85%",
              sm: "380px",
            },
            maxWidth: "420px",
            height: "100%",
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: "28px",
            borderBottomLeftRadius: "28px",
            boxShadow: "-16px 0 48px rgba(8, 25, 77, 0.16)",
            borderLeft: "1px solid rgba(220, 230, 246, 0.8)",
            p: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            fontFamily: '"Manrope", sans-serif',
            "@media (prefers-reduced-motion: reduce)": {
              transition: "none !important",
            },
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          backgroundColor: "#FFFFFF",
        }}
      >
        <LandingDrawerHeader onClose={onClose} />

        <Box
          sx={{
            flex: "1 1 auto",
            overflowY: "auto",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
            px: { xs: 2, sm: 2.5 },
            display: "flex",
            flexDirection: "column",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <LandingDrawerNavItems
            activeSection={activeSection}
            onNavClick={onNavClick}
          />

          <LandingDrawerAuthSection onAuthNav={onAuthNav} />

          <Box sx={{ height: 12, flexShrink: 0 }} />
        </Box>

        <LandingDrawerFooter />
      </Box>
    </Drawer>
  );
};

export default MobileNavDrawer;
