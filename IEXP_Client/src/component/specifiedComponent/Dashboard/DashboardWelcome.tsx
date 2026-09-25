import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import NewInterviewModal from "./NewInterviewModal";
import { invalidateDashboard, invalidateInterviews } from "../../../services/apiQueries";

interface NewInterviewData {
  role: string;
  interviewType:
    | "Technical"
    | "Behavioral"
    | "Mixed";
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard";
}

const DashboardWelcome: React.FC = () => {
  const [openModal, setOpenModal] =
    useState(false);

  const navigate = useNavigate();

  const storedUser =
    localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const userName =
    user?.name || "there";

  const handleCreateInterview = async (
    data: NewInterviewData
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        console.error(
          "Authentication token not found"
        );
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/interviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error(
          "Create interview error:",
          result.message
        );
        return;
      }

      console.log(
        "Interview created:",
        result
      );

      const interviewId =
        result.interview?.id;

      if (!interviewId) {
        console.error(
          "Interview ID not found:",
          result
        );
        return;
      }

      invalidateDashboard();
      invalidateInterviews();

      setOpenModal(false);

      navigate(
        `/interviews/${interviewId}`
      );
    } catch (error) {
      console.error(
        "Create interview error:",
        error
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          mb: "28px",
          flexWrap: {
            xs: "wrap",
            sm: "nowrap",
          },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: "20px",
                sm: "28px",
                md: "30px",
              },
              fontWeight: 700,
              color: "#172033",
              lineHeight: 1.25,
              letterSpacing: "-0.5px",
            }}
          >
            Good morning, {userName}
          </Typography>

          <Typography
            sx={{
              mt: "7px",
              fontSize: "14px",
              color: "#697386",
              fontWeight: 500,
            }}
          >
            Ready for your next interview?
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            setOpenModal(true)
          }
          sx={{
            minWidth: "150px",
            height: "44px",
            px: "18px",
            borderRadius: "10px",
            textTransform: "none",
            fontFamily:
              '"Manrope", sans-serif',
            fontSize: "13px",
            fontWeight: 700,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          New Interview
        </Button>
      </Box>

      <NewInterviewModal
        open={openModal}
        onClose={() =>
          setOpenModal(false)
        }
        onCreate={
          handleCreateInterview
        }
      />
    </>
  );
};

export default DashboardWelcome;