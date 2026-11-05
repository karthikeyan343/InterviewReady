import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

export const DetailHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/reports")}
        sx={{
          textTransform: "none",
          color: "#536887",
          px: 0,
        }}
      >
        Back to Reports
      </Button>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: "24px", sm: "30px", md: "38px" },
              lineHeight: 1.2,
              fontWeight: 800,
              letterSpacing: { xs: "-0.5px", md: "-1px" },
            }}
          >
            Interview Report
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              color: "#7185a3",
              fontSize: { xs: "12px", sm: "14px", md: "15px" },
            }}
          >
            Here&apos;s your performance summary. Keep practicing to improve.
          </Typography>
        </Box>

        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/interviews")}
          sx={{
            textTransform: "none",
            borderRadius: 1.7,
            px: 2.5,
            py: 1.2,
            fontWeight: 700,
          }}
        >
          Try Another Interview
        </Button>
      </Box>
    </>
  );
};
