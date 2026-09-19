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

const NewInterviewModal: React.FC<NewInterviewModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [role, setRole] = useState("");

  const [interviewType, setInterviewType] = useState<
    "Technical" | "Behavioral" | "Mixed"
  >("Technical");

  const [difficulty, setDifficulty] = useState<
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
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",

            mb: {
              xs: "18px",
              sm: "24px",
            },

            gap: "12px",
          }}
        >
          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              id="new-interview-modal-title"
              sx={{
                fontSize: {
                  xs: "18px",
                  sm: "20px",
                },

                lineHeight: {
                  xs: 1.25,
                  sm: 1.3,
                },

                fontWeight: 800,
                color: "#172033",

                wordBreak: "break-word",
              }}
            >
              Create New Interview
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "11px",
                  sm: "12px",
                },

                lineHeight: 1.5,

                fontWeight: 500,
                color: "#7a8497",

                mt: {
                  xs: "4px",
                  sm: "5px",
                },
              }}
            >
              Set up your interview preferences
            </Typography>
          </Box>

          <IconButton
            onClick={handleClose}
            aria-label="Close"
            sx={{
              width: {
                xs: "32px",
                sm: "34px",
              },

              height: {
                xs: "32px",
                sm: "34px",
              },

              minWidth: {
                xs: "32px",
                sm: "34px",
              },

              minHeight: {
                xs: "32px",
                sm: "34px",
              },

              flexShrink: 0,

              color: "#7a8497",
              borderRadius: "9px",

              "&:hover": {
                backgroundColor: "#f5f7fb",
              },

              "&:active": {
                backgroundColor: "#eef2f8",
              },
            }}
          >
            <CloseIcon
              sx={{
                fontSize: {
                  xs: "18px",
                  sm: "19px",
                },
              }}
            />
          </IconButton>
        </Box>

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

        {/* Interview Type */}
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
                xs: "8px",
                sm: "9px",
              },
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

              gap: {
                xs: "7px",
                sm: "8px",
              },
            }}
          >
            {(
              ["Technical", "Behavioral", "Mixed"] as const
            ).map((type) => (
              <Button
                key={type}
                onClick={() => setInterviewType(type)}
                variant="outlined"
                sx={{
                  height: {
                    xs: "40px",
                    sm: "42px",
                  },

                  minHeight: {
                    xs: "40px",
                    sm: "42px",
                  },

                  borderRadius: {
                    xs: "8px",
                    sm: "9px",
                  },

                  textTransform: "none",

                  fontFamily: '"Manrope", sans-serif',

                  fontSize: {
                    xs: "10.5px",
                    sm: "11px",
                  },

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

                  px: {
                    xs: "10px",
                    sm: "12px",
                  },

                  whiteSpace: "nowrap",

                  "&:hover": {
                    borderColor: "#356ae6",
                    backgroundColor: "#f4f7ff",
                  },

                  "&:active": {
                    backgroundColor: "#edf3ff",
                  },
                }}
              >
                {type}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Difficulty */}
        <Box
          sx={{
            mb: {
              xs: "19px",
              sm: "24px",
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
                xs: "8px",
                sm: "9px",
              },
            }}
          >
            Difficulty
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",

              gap: {
                xs: "7px",
                sm: "8px",
              },
            }}
          >
            {(["Easy", "Medium", "Hard"] as const).map(
              (level) => (
                <Button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  variant="outlined"
                  sx={{
                    height: {
                      xs: "40px",
                      sm: "42px",
                    },

                    minHeight: {
                      xs: "40px",
                      sm: "42px",
                    },

                    minWidth: 0,

                    borderRadius: {
                      xs: "8px",
                      sm: "9px",
                    },

                    textTransform: "none",

                    fontFamily: '"Manrope", sans-serif',

                    fontSize: {
                      xs: "10.5px",
                      sm: "11px",
                    },

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

                    px: {
                      xs: "6px",
                      sm: "10px",
                    },

                    whiteSpace: "nowrap",

                    "&:hover": {
                      borderColor: "#356ae6",
                      backgroundColor: "#f4f7ff",
                    },

                    "&:active": {
                      backgroundColor: "#edf3ff",
                    },
                  }}
                >
                  {level}
                </Button>
              )
            )}
          </Box>
        </Box>

        {/* Error */}
        {error && (
          <Box
            sx={{
              backgroundColor: "#fff1f1",
              border: "1px solid #ffd6d6",

              borderRadius: {
                xs: "7px",
                sm: "8px",
              },

              px: {
                xs: "9px",
                sm: "10px",
              },

              py: {
                xs: "7px",
                sm: "8px",
              },

              mb: {
                xs: "13px",
                sm: "16px",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "10px",
                  sm: "11px",
                },

                lineHeight: 1.45,

                fontWeight: 600,
                color: "#c54444",

                wordBreak: "break-word",
              }}
            >
              {error}
            </Typography>
          </Box>
        )}

        {/* Footer */}
        <Box
          sx={{
            display: "flex",

            flexDirection: {
              xs: "row",
              sm: "row",
            },

            justifyContent: "flex-end",

            gap: {
              xs: "8px",
              sm: "9px",
            },

            pt: {
              xs: "2px",
              sm: "4px",
            },

            width: "100%",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              height: {
                xs: "40px",
                sm: "40px",
              },

              minHeight: {
                xs: "40px",
                sm: "40px",
              },

              px: {
                xs: "14px",
                sm: "17px",
              },

              borderRadius: {
                xs: "8px",
                sm: "9px",
              },

              textTransform: "none",

              fontFamily: '"Manrope", sans-serif',

              fontSize: {
                xs: "10.5px",
                sm: "11px",
              },

              fontWeight: 700,

              borderColor: "#dce2ec",
              color: "#697386",

              whiteSpace: "nowrap",

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
              height: {
                xs: "40px",
                sm: "40px",
              },

              minHeight: {
                xs: "40px",
                sm: "40px",
              },

              px: {
                xs: "15px",
                sm: "18px",
              },

              borderRadius: {
                xs: "8px",
                sm: "9px",
              },

              textTransform: "none",

              fontFamily: '"Manrope", sans-serif',

              fontSize: {
                xs: "10.5px",
                sm: "11px",
              },

              fontWeight: 700,

              boxShadow: "none",

              whiteSpace: "nowrap",

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