import React from "react";
import type { SvgIconComponent } from "@mui/icons-material";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface NavigationItem {
  label: string;
  path: string;
  icon: SvgIconComponent;
}

export interface DashboardNavbarProps {
  hideNavLinks?: boolean;
  rightAction?: React.ReactNode;
}
