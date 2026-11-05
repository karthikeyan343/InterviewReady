import React from "react";
import { Box, Drawer } from "@mui/material";
import type { MobileNavDrawerProps } from "./types";
import DrawerHeader from "./components/DrawerHeader";
import DrawerNavItems from "./components/DrawerNavItems";
import DrawerAccountSection from "./components/DrawerAccountSection";
import DrawerFooter from "./components/DrawerFooter";

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  open,
  user,
  userName,
  isNavigationItemActive,
  onClose,
  onNavigate,
  onProfile,
  onLogout,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      aria-label="Dashboard mobile navigation drawer"
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
              sm: "360px",
            },
            maxWidth: "380px",
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
        <DrawerHeader onClose={onClose} />

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
          <DrawerNavItems
            isNavigationItemActive={isNavigationItemActive}
            onNavigate={onNavigate}
          />

          <DrawerAccountSection
            user={user}
            userName={userName}
            onProfile={onProfile}
            onLogout={onLogout}
          />

          <Box sx={{ height: 16, flexShrink: 0 }} />
        </Box>

        <DrawerFooter />
      </Box>
    </Drawer>
  );
};

export default MobileNavDrawer;
