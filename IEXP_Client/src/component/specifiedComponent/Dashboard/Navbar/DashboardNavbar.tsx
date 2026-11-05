import React from "react";
import { Box } from "@mui/material";
import type { DashboardNavbarProps } from "./types";
import { useDashboardNavbar } from "./useDashboardNavbar";
import { NavBrandLogo } from "./NavBrandLogo";
import { DesktopNavLinks } from "./DesktopNavLinks";
import { DesktopUserActions } from "./DesktopUserActions";
import { UserProfileMenu } from "./UserProfileMenu";
import { MobileNavDrawer } from "./MobileNavDrawer";

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  hideNavLinks = false,
  rightAction,
}) => {
  const {
    user,
    userName,
    firstName,
    anchorEl,
    menuOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    handleNavigation,
    handleProfileMenu,
    handleCloseMenu,
    handleProfile,
    handleLogout,
    isNavigationItemActive,
  } = useDashboardNavbar();

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        height: { xs: "66px", sm: "70px", md: "72px" },
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #DCE6F6",
        boxShadow: "0 2px 10px rgba(8, 25, 77, 0.03)",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1100,
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1440px",
          height: "100%",
          mx: "auto",
          px: {
            xs: "16px",
            sm: "24px",
            md: "36px",
            lg: "48px",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minWidth: 0,
        }}
      >
        {/* ── LEFT: Logo ── */}
        <NavBrandLogo />

        {/* ── CENTER: Desktop Navigation Items ── */}
        {!hideNavLinks && (
          <DesktopNavLinks
            isNavigationItemActive={isNavigationItemActive}
            handleNavigation={handleNavigation}
          />
        )}

        {/* ── RIGHT: User Controls & Mobile Actions OR Custom Action ── */}
        {hideNavLinks ? (
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            {rightAction}
          </Box>
        ) : (
          <DesktopUserActions
            user={user}
            userName={userName}
            firstName={firstName}
            menuOpen={menuOpen}
            onOpenProfileMenu={handleProfileMenu}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />
        )}

        {/* ── User Profile Dropdown Menu ── */}
        <UserProfileMenu
          anchorEl={anchorEl}
          menuOpen={menuOpen}
          user={user}
          userName={userName}
          onClose={handleCloseMenu}
          onProfile={handleProfile}
          onLogout={handleLogout}
        />
      </Box>

      {/* ── Mobile Navigation Drawer ── */}
      <MobileNavDrawer
        open={mobileMenuOpen}
        user={user}
        userName={userName}
        isNavigationItemActive={isNavigationItemActive}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={handleNavigation}
        onProfile={handleProfile}
        onLogout={handleLogout}
      />
    </Box>
  );
};
