import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface NewInterviewModalProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: {
    role: string;
    interviewType: "Technical" | "Behavioral" | "Mixed";
    difficulty: "Easy" | "Medium" | "Hard";
  }) => void;
}

const NewInterviewModal: React.FC<
  NewInterviewModalProps
> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [role, setRole] = useState("");

  const [interviewType, setInterviewType] =
    useState<
      "Technical" | "Behavioral" | "Mixed"
    >("Technical");

  const [difficulty, setDifficulty] =
    useState<
      "Easy" | "Medium" | "Hard"
    >("Medium");

  const [error, setError] = useState("");

  const handleCreate = () => {
    const cleanedRole = role.trim();

    if (!cleanedRole) {
      setError("Please enter a job role.");
      return;
    }

    setError("");

    onCreate?.({
      role: cleanedRole,
      interviewType,
      difficulty,
    });
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="new-interview-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: {
            xs: "calc(100% - 32px)",
            sm: "520px",
          },
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(23, 32, 51, 0.16)",
          p: {
            xs: "22px",
            sm: "28px",
          },
          outline: "none",
          fontFamily: '"Manrope", sans-serif',
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: "24px",
          }}
        >
          <Box>
            <Typography
              id="new-interview-modal-title"
              sx={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#172033",
              }}
            >
              Create New Interview
            </Typography>

            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                color: "#7a8497",
                mt: "5px",
              }}
            >
              Set up your interview preferences
            </Typography>
          </Box>

          <IconButton
            onClick={handleClose}
            sx={{
              width: "34px",
              height: "34px",
              color: "#7a8497",
              borderRadius: "9px",
              "&:hover": {
                backgroundColor: "#f5f7fb",
              },
            }}
          >
            <CloseIcon
              sx={{
                fontSize: "19px",
              }}
            />
          </IconButton>
        </Box>
        <Box sx={{ mb: "22px" }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 800,
              color: "#172033",
              mb: "8px",
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
                height: "44px",
                borderRadius: "9px",
                fontFamily:
                  '"Manrope", sans-serif',
                fontSize: "12px",
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
              "& input::placeholder": {
                color: "#9aa3b2",
                opacity: 1,
              },
            }}
          />
        </Box>
        <Box sx={{ mb: "22px" }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 800,
              color: "#172033",
              mb: "9px",
            }}
          >
            Interview Type
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)",
              },
              gap: "8px",
            }}
          >
            {(
              [
                "Technical",
                "Behavioral",
                "Mixed",
              ] as const
            ).map((type) => (
              <Button
                key={type}
                onClick={() =>
                  setInterviewType(type)
                }
                variant="outlined"
                sx={{
                  height: "42px",
                  borderRadius: "9px",
                  textTransform: "none",
                  fontFamily:
                    '"Manrope", sans-serif',
                  fontSize: "11px",
                  fontWeight: 700,
                  borderColor:
                    interviewType === type
                      ? "#356ae6"
                      : "#dfe4ec",
                  color:
                    interviewType === type
                      ? "#356ae6"
                      : "#697386",
                  backgroundColor:
                    interviewType === type
                      ? "#f4f7ff"
                      : "#ffffff",
                  "&:hover": {
                    borderColor: "#356ae6",
                    backgroundColor: "#f4f7ff",
                  },
                }}
              >
                {type}
              </Button>
            ))}
          </Box>
        </Box>
        <Box sx={{ mb: "24px" }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 800,
              color: "#172033",
              mb: "9px",
            }}
          >
            Difficulty
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap: "8px",
            }}
          >
            {(
              [
                "Easy",
                "Medium",
                "Hard",
              ] as const
            ).map((level) => (
              <Button
                key={level}
                onClick={() =>
                  setDifficulty(level)
                }
                variant="outlined"
                sx={{
                  height: "42px",
                  borderRadius: "9px",
                  textTransform: "none",
                  fontFamily:
                    '"Manrope", sans-serif',
                  fontSize: "11px",
                  fontWeight: 700,
                  borderColor:
                    difficulty === level
                      ? "#356ae6"
                      : "#dfe4ec",
                  color:
                    difficulty === level
                      ? "#356ae6"
                      : "#697386",
                  backgroundColor:
                    difficulty === level
                      ? "#f4f7ff"
                      : "#ffffff",
                  "&:hover": {
                    borderColor: "#356ae6",
                    backgroundColor: "#f4f7ff",
                  },
                }}
              >
                {level}
              </Button>
            ))}
          </Box>
        </Box>
        {error && (
          <Box
            sx={{
              backgroundColor: "#fff1f1",
              border: "1px solid #ffd6d6",
              borderRadius: "8px",
              px: "10px",
              py: "8px",
              mb: "16px",
            }}
          >
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#c54444",
              }}
            >
              {error}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "9px",
            pt: "4px",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              height: "40px",
              px: "17px",
              borderRadius: "9px",
              textTransform: "none",
              fontFamily:
                '"Manrope", sans-serif',
              fontSize: "11px",
              fontWeight: 700,
              borderColor: "#dce2ec",
              color: "#697386",
              "&:hover": {
                borderColor: "#c5ccd8",
                backgroundColor: "#f7f9fc",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreate}
            sx={{
              height: "40px",
              px: "18px",
              borderRadius: "9px",
              textTransform: "none",
              fontFamily:
                '"Manrope", sans-serif',
              fontSize: "11px",
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            Create Interview
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewInterviewModal;