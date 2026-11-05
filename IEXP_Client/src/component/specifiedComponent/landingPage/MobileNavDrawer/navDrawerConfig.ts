import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";

export interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export const navDrawerItems: MobileNavItem[] = [
  {
    label: "Home",
    href: "#home",
    icon: HomeOutlinedIcon,
  },
  {
    label: "Features",
    href: "#features",
    icon: GridViewOutlinedIcon,
  },
  {
    label: "How It Works",
    href: "#how-it-works",
    icon: SettingsOutlinedIcon,
  },
  {
    label: "About Us",
    href: "#about-us",
    icon: PeopleOutlineRoundedIcon,
  },
];
