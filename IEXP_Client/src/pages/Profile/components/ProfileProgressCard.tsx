import React from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

interface ProfileProgressCardProps {
  loading: boolean;
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  resumeUploaded: boolean;
  onNavigateReports: () => void;
}

export const ProfileProgressCard: React.FC<ProfileProgressCardProps> = ({
  loading,
  totalInterviews,
  completedInterviews,
  averageScore,
  resumeUploaded,
  onNavigateReports,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E4E9F1",
        borderRadius: "16px",
        p: {
          xs: "22px",
          md: "30px",
        },
      }}
    >
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 800,
          color: "#101B46",
        }}
      >
        Your progress
      </Typography>

      <Typography
        sx={{
          mt: "5px",
          mb: "24px",
          fontSize: "12px",
          color: "#7182A8",
        }}
      >
        Your current interview activity.
      </Typography>

      {loading ? (
        <Box
          sx={{
            minHeight: "220px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            size={26}
            sx={{
              color: "#1769E8",
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <Box
            sx={{
              border: "1px solid #E6EBF2",
              borderRadius: "11px",
              p: "16px",
            }}
          >
            <WorkOutlineOutlinedIcon
              sx={{
                fontSize: "19px",
                color: "#1769E8",
                mb: "9px",
              }}
            />

            <Typography
              sx={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#101B46",
              }}
            >
              {totalInterviews}
            </Typography>

            <Typography
              sx={{
                mt: "2px",
                fontSize: "10px",
                color: "#7182A8",
              }}
            >
              Total interviews
            </Typography>
          </Box>

          <Box
            sx={{
              border: "1px solid #E6EBF2",
              borderRadius: "11px",
              p: "16px",
            }}
          >
            <CheckCircleOutlineOutlinedIcon
              sx={{
                fontSize: "19px",
                color: "#36A56C",
                mb: "9px",
              }}
            />

            <Typography
              sx={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#101B46",
              }}
            >
              {completedInterviews}
            </Typography>

            <Typography
              sx={{
                mt: "2px",
                fontSize: "10px",
                color: "#7182A8",
              }}
            >
              Completed
            </Typography>
          </Box>

          <Box
            sx={{
              border: "1px solid #E6EBF2",
              borderRadius: "11px",
              p: "16px",
            }}
          >
            <TrendingUpOutlinedIcon
              sx={{
                fontSize: "19px",
                color: "#7656D8",
                mb: "9px",
              }}
            />

            <Typography
              sx={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#101B46",
              }}
            >
              {averageScore}%
            </Typography>

            <Typography
              sx={{
                mt: "2px",
                fontSize: "10px",
                color: "#7182A8",
              }}
            >
              Average score
            </Typography>
          </Box>

          <Box
            sx={{
              border: "1px solid #E6EBF2",
              borderRadius: "11px",
              p: "16px",
            }}
          >
            <DescriptionOutlinedIcon
              sx={{
                fontSize: "19px",
                color: "#E19A3E",
                mb: "9px",
              }}
            />

            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#101B46",
              }}
            >
              {resumeUploaded ? "Ready" : "Pending"}
            </Typography>

            <Typography
              sx={{
                mt: "4px",
                fontSize: "10px",
                color: "#7182A8",
              }}
            >
              Resume status
            </Typography>
          </Box>
        </Box>
      )}

      <Button
        onClick={onNavigateReports}
        fullWidth
        sx={{
          mt: "18px",
          height: "40px",
          borderRadius: "8px",
          backgroundColor: "#1769E8",
          color: "#FFFFFF",
          textTransform: "none",
          fontSize: "11px",
          fontWeight: 700,
          "&:hover": {
            backgroundColor: "#0D5FD1",
          },
        }}
      >
        View reports
      </Button>
    </Box>
  );
};

export default ProfileProgressCard;
