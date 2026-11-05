import React from "react";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

export interface StepItem {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const steps: StepItem[] = [
  {
    number: "1",
    icon: <DescriptionOutlinedIcon />,
    title: "Upload Your Resume",
    description: "Let InterviewReady understand your background.",
  },
  {
    number: "2",
    icon: <TuneOutlinedIcon />,
    title: "Choose Your Interview",
    description: "Select the role, experience level, and difficulty.",
  },
  {
    number: "3",
    icon: <VideoCameraFrontOutlinedIcon />,
    title: "Practice with AI",
    description: "Answer questions in a realistic interview environment.",
  },
  {
    number: "4",
    icon: <BarChartOutlinedIcon />,
    title: "Get Detailed Feedback",
    description: "Review your performance and improve your skills.",
  },
];
