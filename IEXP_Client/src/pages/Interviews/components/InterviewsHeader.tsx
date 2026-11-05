import React from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface InterviewsHeaderProps {
  onOpenNewInterview: () => void;
}

export const InterviewsHeader: React.FC<InterviewsHeaderProps> = ({
  onOpenNewInterview,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: {
          xs: "flex-start",
          md: "center",
        },
        flexDirection: {
          xs: "column",
          md: "row",
        },
        gap: 2,
        mb: 4,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: { xs: 28, md: 36 },
            fontWeight: 800,
            letterSpacing: "-1px",
          }}
        >
          My Interviews
        </Typography>

        <Typography
          sx={{
            mt: 0.8,
            color: "#7185a3",
            fontSize: 15,
          }}
        >
          Review your practice sessions and continue unfinished interviews.
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onOpenNewInterview}
        sx={{
          textTransform: "none",
          borderRadius: "10px",
          px: 2.5,
          py: 1.4,
          fontWeight: 700,
          backgroundColor: "#1677e8",
          boxShadow: "none",
        }}
      >
        New Interview
      </Button>
    </Box>
  );
};

export default InterviewsHeader;
