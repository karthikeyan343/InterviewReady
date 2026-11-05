import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import type { NavigationItem } from "./types";

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: DashboardOutlinedIcon,
  },
  {
    label: "Interviews",
    path: "/interviews",
    icon: VideoCameraFrontOutlinedIcon,
  },
  {
    label: "Resume",
    path: "/resume",
    icon: DescriptionOutlinedIcon,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: AssessmentOutlinedIcon,
  },
];
