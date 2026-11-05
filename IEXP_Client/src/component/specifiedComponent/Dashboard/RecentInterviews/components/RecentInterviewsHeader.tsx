import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface RecentInterviewsHeaderProps {
  hasInterviews: boolean;
  onViewAll: () => void;
}

export const RecentInterviewsHeader: React.FC<RecentInterviewsHeaderProps> = ({
  hasInterviews,
  onViewAll,
}) => {
  return (
    <Box
      sx={{
        px: {
          xs: "18px",
          md: "24px",
        },
        py: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #edf0f4",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 800,
            color: "#172033",
          }}
        >
          Recent Interviews
        </Typography>

        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 500,
            color: "#7a8497",
            mt: "4px",
          }}
        >
          Your latest practice sessions
        </Typography>
      </Box>

      {hasInterviews && (
        <Button
          endIcon={<ArrowForwardIcon />}
          onClick={onViewAll}
          sx={{
            textTransform: "none",
            fontFamily: '"Manrope", sans-serif',
            fontSize: "12px",
            fontWeight: 700,
            color: "#356ae6",
            minWidth: "auto",
            px: "8px",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          View All
        </Button>
      )}
    </Box>
  );
};

export default RecentInterviewsHeader;
