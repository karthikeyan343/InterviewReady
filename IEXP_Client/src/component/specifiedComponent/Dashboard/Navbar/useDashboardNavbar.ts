import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAllUserCache } from "../../../../services/apiQueries";
import type { User } from "./types";

export const useDashboardNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuOpen = Boolean(anchorEl);

  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.name || "User";
  const firstName = userName.split(" ")[0];

  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    if (location.pathname === path) return;
    navigate(path, { replace: true });
  };

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleCloseMenu();
    setMobileMenuOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    handleCloseMenu();
    setMobileMenuOpen(false);

    clearAllUserCache();
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const isNavigationItemActive = (path: string) => {
    return (
      location.pathname === path ||
      (path !== "/dashboard" && location.pathname.startsWith(`${path}/`))
    );
  };

  return {
    location,
    user,
    userName,
    firstName,
    anchorEl,
    setAnchorEl,
    menuOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    handleNavigation,
    handleProfileMenu,
    handleCloseMenu,
    handleProfile,
    handleLogout,
    isNavigationItemActive,
  };
};

export type DashboardNavbarState = ReturnType<typeof useDashboardNavbar>;
