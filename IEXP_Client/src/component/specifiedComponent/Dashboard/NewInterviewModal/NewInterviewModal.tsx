import React from "react";
import { Box, Modal, TextField, Typography } from "@mui/material";
import type { NewInterviewModalProps } from "./types";
import { useNewInterviewForm } from "./hooks/useNewInterviewForm";
import ModalHeader from "./components/ModalHeader";
import InterviewTypeSelector from "./components/InterviewTypeSelector";
import DifficultySelector from "./components/DifficultySelector";
import ModalFooter from "./components/ModalFooter";

export const NewInterviewModal: React.FC<NewInterviewModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const {
    role,
    setRole,
    interviewType,
    setInterviewType,
    difficulty,
    setDifficulty,
    error,
    setError,
    handleCreate,
    handleClose,
  } = useNewInterviewForm({ onClose, onCreate });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="new-interview-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: {
          xs: "12px",
          sm: "20px",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: {
            xs: "100%",
            sm: "520px",
          },
          maxWidth: {
            xs: "calc(100vw - 24px)",
            sm: "520px",
          },
          maxHeight: {
            xs: "calc(100dvh - 24px)",
            sm: "90vh",
          },
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: "#ffffff",
          borderRadius: {
            xs: "14px",
            sm: "16px",
          },
          boxShadow: "0 20px 60px rgba(23, 32, 51, 0.16)",
          p: {
            xs: "18px",
            sm: "28px",
          },
          outline: "none",
          fontFamily: '"Manrope", sans-serif',
          boxSizing: "border-box",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#d9deea",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        }}
      >
        <ModalHeader onClose={handleClose} />

        {error && (
          <Box
            sx={{
              backgroundColor: "#fff1f1",
              border: "1px solid #ffd6d6",
              borderRadius: "8px",
              px: "12px",
              py: "10px",
              mb: {
                xs: "16px",
                sm: "18px",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "11.5px",
                  sm: "12px",
                },
                fontWeight: 600,
                color: "#c54444",
                fontFamily: '"Manrope", sans-serif',
                lineHeight: 1.45,
              }}
            >
              {error}
            </Typography>
          </Box>
        )}

        {/* Job Role */}
        <Box
          sx={{
            mb: {
              xs: "17px",
              sm: "22px",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "11px",
                sm: "12px",
              },
              fontWeight: 800,
              color: "#172033",
              mb: {
                xs: "7px",
                sm: "8px",
              },
            }}
          >
            Job Role
          </Typography>

          <TextField
            fullWidth
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setError("");
            }}
            placeholder="e.g. Frontend Developer"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                height: {
                  xs: "42px",
                  sm: "44px",
                },
                borderRadius: {
                  xs: "8px",
                  sm: "9px",
                },
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "11px",
                  sm: "12px",
                },
                "& fieldset": {
                  borderColor: "#dfe4ec",
                },
                "&:hover fieldset": {
                  borderColor: "#bfc8d8",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#356ae6",
                },
              },
              "& input": {
                padding: {
                  xs: "0 12px",
                  sm: "0 14px",
                },
              },
              "& input::placeholder": {
                color: "#9aa3b2",
                opacity: 1,
              },
            }}
          />
        </Box>

        <InterviewTypeSelector
          interviewType={interviewType}
          onSelectType={setInterviewType}
        />

        <DifficultySelector
          difficulty={difficulty}
          onSelectDifficulty={setDifficulty}
        />

        <ModalFooter onCancel={handleClose} onCreate={handleCreate} />
      </Box>
    </Modal>
  );
};

export default NewInterviewModal;
