import type { SvgIconComponent } from "@mui/icons-material";
import {
  ChatBubbleOutlined,
  AutoAwesomeOutlined,
  TrendingUp,
} from "@mui/icons-material";

export interface FeaturePill {
  id: string;
  title: string;
  subtitle: string;
  Icon: SvgIconComponent;
  color: string;
  iconBackground: string;
}

export const featurePills: FeaturePill[] = [
  {
    id: "interview",
    title: "Real Interview",
    subtitle: "Experience",
    Icon: ChatBubbleOutlined,
    color: "#1468F2",
    iconBackground: "rgba(20, 104, 242, 0.12)",
  },
  {
    id: "feedback",
    title: "Instant",
    subtitle: "AI Feedback",
    Icon: AutoAwesomeOutlined,
    color: "#9333EA",
    iconBackground: "rgba(147, 51, 234, 0.12)",
  },
  {
    id: "progress",
    title: "Track",
    subtitle: "Your Progress",
    Icon: TrendingUp,
    color: "#10B981",
    iconBackground: "rgba(16, 185, 129, 0.12)",
  },
];
