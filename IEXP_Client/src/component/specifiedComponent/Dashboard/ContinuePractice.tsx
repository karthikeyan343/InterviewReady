import React from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "../../../services/apiQueries";

const ContinuePractice: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading: loading } = useDashboardData();
  const practice = data?.continuePractice ?? null;

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#ffffff",
          border: "1px solid #e8ebf1",
          borderRadius: "14px",
          p: "24px",
          minHeight: "190px",
        }}
      />
    );
  }

  const hasPractice = practice !== null;

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        border: "1px solid #e8ebf1",
        borderRadius: "14px",
        p: {
          xs: "20px",
          md: "24px",
        },
        minHeight: "190px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "20px",
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
            Continue Practicing
          </Typography>

          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#7a8497",
              mt: "4px",
            }}
          >
            Pick up where you left off
          </Typography>
        </Box>

        <Box
          sx={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            backgroundColor: "#f1f5ff",
            color: "#356ae6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PlayArrowOutlinedIcon
            sx={{
              fontSize: "21px",
            }}
          />
        </Box>
      </Box>
      {hasPractice && practice ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flex: 1,
          }}
        >
          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 800,
                color: "#172033",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {practice.role}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "6px",
                mt: "6px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#7a8497",
                }}
              >
                {practice.interviewType}
              </Typography>

              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#c1c6cf",
                }}
              >
                •
              </Typography>

              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#7a8497",
                }}
              >
                {practice.difficulty}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "inline-flex",
                mt: "9px",
                px: "8px",
                py: "4px",
                borderRadius: "6px",
                backgroundColor:
                  practice.status === "In Progress"
                    ? "#fff5e8"
                    : "#f1f5ff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color:
                    practice.status === "In Progress"
                      ? "#b86b00"
                      : "#356ae6",
                }}
              >
                {practice.status}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() =>
              navigate(
                `/interviews/${practice.id}`
              )
            }
            sx={{
              flexShrink: 0,
              height: "38px",
              px: "14px",
              borderRadius: "9px",
              textTransform: "none",
              fontFamily: '"Manrope", sans-serif',
              fontSize: "11px",
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {practice.status === "In Progress"
              ? "Continue"
              : "Start Interview"}
          </Button>
        </Box>
      ) : (
  
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flex: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#172033",
              }}
            >
              Ready for a new practice session?
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 500,
                color: "#7a8497",
                mt: "5px",
              }}
            >
              Start a new interview and improve
              your skills.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate("/interviews")}
            sx={{
              flexShrink: 0,
              height: "38px",
              px: "14px",
              borderRadius: "9px",
              textTransform: "none",
              fontFamily: '"Manrope", sans-serif',
              fontSize: "11px",
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
      )}
    </Box>
  );
};

export default ContinuePractice;