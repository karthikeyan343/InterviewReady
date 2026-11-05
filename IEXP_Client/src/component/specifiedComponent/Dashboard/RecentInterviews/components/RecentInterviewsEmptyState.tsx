import React from "react";
import { Box, Button, Typography } from "@mui/material";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

interface RecentInterviewsEmptyStateProps {
  onStartInterview: () => void;
}

export const RecentInterviewsEmptyState: React.FC<RecentInterviewsEmptyStateProps> = ({
  onStartInterview,
}) => {
  return (
    <Box
      sx={{
        minHeight: "230px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: "20px",
      }}
    >
      <Box>
        <Box
          sx={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            backgroundColor: "#f1f5ff",
            color: "#356ae6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: "14px",
          }}
        >
          <HistoryOutlinedIcon
            sx={{
              fontSize: "24px",
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#172033",
          }}
        >
          No interviews yet
        </Typography>

        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 500,
            color: "#7a8497",
            mt: "6px",
            mb: "16px",
          }}
        >
          Start your first interview practice session.
        </Typography>

        <Button
          variant="contained"
          onClick={onStartInterview}
          sx={{
            height: "38px",
            px: "16px",
            borderRadius: "9px",
            textTransform: "none",
            fontFamily: '"Manrope", sans-serif',
            fontSize: "12px",
            fontWeight: 700,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          Start Interview
        </Button>
      </Box>
    </Box>
  );
};

export default RecentInterviewsEmptyState;
