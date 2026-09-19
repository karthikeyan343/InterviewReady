import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";

import DashboardNavbar from "../component/specifiedComponent/Dashboard/DashboardNavbar";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

interface ResumeData {
  id: string;
  originalFileName: string;
  fileType: string;
  uploadedAt: string;
  updatedAt?: string;
}

const ResumePage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getToken = () => localStorage.getItem("token");

  const fetchResume = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch("/api/resume/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      const data = await response.json();

      if (response.status === 404) {
        setResume(null);
        return;
      }

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load resume.");
      }

      setResume(data.resume);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load resume."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setMessage("");

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and DOCX files are allowed.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const token = getToken();

      const response = await fetch("/api/resume/upload", {
        method: "POST",
        headers: {
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to upload resume.");
      }

      setResume(data.resume);
      setMessage(data.message || "Resume uploaded successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload resume."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleViewResume = async () => {
    try {
      setViewing(true);
      setError("");

      const token = getToken();

      const response = await fetch("/api/resume/view", {
        method: "GET",
        headers: {
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to open resume.");
      }

      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to open resume."
      );
    } finally {
      setViewing(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f6f8fc",
        color: "#172b4d",
        fontFamily: '"Manrope", sans-serif',
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <DashboardNavbar />

      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: "1250px",
          mx: "auto",
          px: {
            xs: "14px",
            sm: "20px",
            md: "40px",
            lg: "48px",
          },
          py: {
            xs: "24px",
            sm: "32px",
            md: "48px",
          },
          boxSizing: "border-box",
        }}
      >
        {/* Page Header */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: {
              xs: 2.5,
              sm: 2,
            },
            mb: {
              xs: 3,
              sm: 4,
            },
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              minWidth: 0,
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "26px",
                  sm: "30px",
                  md: "36px",
                },
                lineHeight: {
                  xs: 1.2,
                  sm: 1.2,
                },
                fontWeight: 800,
                letterSpacing: {
                  xs: "-0.6px",
                  md: "-1px",
                },
                color: "#172b4d",
                overflowWrap: "break-word",
              }}
            >
              My Resume
            </Typography>

            <Typography
              sx={{
                mt: {
                  xs: 0.8,
                  sm: 1,
                },
                color: "#7185a3",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "13px",
                  sm: "14px",
                  md: "15px",
                },
                lineHeight: 1.55,
                maxWidth: {
                  xs: "100%",
                  sm: "520px",
                },
              }}
            >
              Upload your resume and keep it ready for your interviews.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<CloudUploadOutlinedIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            fullWidth={false}
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              minHeight: {
                xs: "46px",
                sm: "48px",
              },
              px: {
                xs: 2,
                sm: 2.5,
              },
              py: {
                xs: 1.15,
                sm: 1.4,
              },
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: '"Manrope", sans-serif',
              fontSize: {
                xs: "13px",
                sm: "14px",
              },
              fontWeight: 700,
              backgroundColor: "#1677e8",
              boxShadow: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              "&:hover": {
                backgroundColor: "#1269d2",
                boxShadow: "none",
              },
            }}
          >
            {uploading
              ? "Uploading..."
              : resume
              ? "Replace Resume"
              : "Upload Resume"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            hidden
            onChange={handleUpload}
          />
        </Box>

        {/* Success Message */}
        {message && (
          <Box
            sx={{
              width: "100%",
              mb: 3,
              p: {
                xs: 1.5,
                sm: 2,
              },
              borderRadius: "12px",
              backgroundColor: "#eaf8ef",
              border: "1px solid #cdebd8",
              boxSizing: "border-box",
            }}
          >
            <Typography
              sx={{
                color: "#26834a",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },
                lineHeight: 1.5,
              }}
            >
              {message}
            </Typography>
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Box
            sx={{
              width: "100%",
              mb: 3,
              p: {
                xs: 1.5,
                sm: 2,
              },
              borderRadius: "12px",
              backgroundColor: "#fff4f3",
              border: "1px solid #f0d0d0",
              boxSizing: "border-box",
            }}
          >
            <Typography
              sx={{
                color: "#c0392b",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },
                lineHeight: 1.5,
                overflowWrap: "break-word",
              }}
            >
              {error}
            </Typography>
          </Box>
        )}

        {/* Loading */}
        {loading ? (
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#fff",
              border: "1px solid #e4e9f1",
              borderRadius: {
                xs: "14px",
                sm: "16px",
              },
              p: {
                xs: 3,
                sm: 5,
              },
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            <Typography
              sx={{
                color: "#7890ae",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "13px",
                  sm: "14px",
                },
              }}
            >
              Loading resume...
            </Typography>
          </Box>
        ) : resume ? (
          /* Resume Card */
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              backgroundColor: "#fff",
              border: "1px solid #e4e9f1",
              borderRadius: {
                xs: "14px",
                sm: "16px",
              },
              p: {
                xs: "16px",
                sm: "20px",
                md: "24px",
              },
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  md: "center",
                },
                justifyContent: "space-between",
                gap: {
                  xs: 2,
                  md: 3,
                },
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                minWidth: 0,
              }}
            >
              {/* Resume Information */}
              <Box
                sx={{
                  width: {
                    xs: "100%",
                    md: "auto",
                  },
                  minWidth: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: {
                    xs: 1.5,
                    sm: 2,
                  },
                  flex: 1,
                }}
              >
                <Avatar
                  sx={{
                    width: {
                      xs: 46,
                      sm: 54,
                    },
                    height: {
                      xs: 46,
                      sm: 54,
                    },
                    flexShrink: 0,
                    backgroundColor: "#edf4ff",
                    color: "#1677e8",
                  }}
                >
                  <DescriptionOutlinedIcon
                    sx={{
                      fontSize: {
                        xs: 22,
                        sm: 26,
                      },
                    }}
                  />
                </Avatar>

                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      width: "100%",
                      minWidth: 0,
                      fontFamily: '"Manrope", sans-serif',
                      fontSize: {
                        xs: "14px",
                        sm: "16px",
                        md: "17px",
                      },
                      lineHeight: 1.4,
                      fontWeight: 750,
                      color: "#172b4d",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={resume.originalFileName}
                  >
                    {resume.originalFileName}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: {
                        xs: 0.6,
                        sm: 0.8,
                      },
                      mt: {
                        xs: 0.8,
                        sm: 1,
                      },
                      minWidth: 0,
                    }}
                  >
                    <Chip
                      label={
                        resume.fileType.includes("pdf") ? "PDF" : "DOCX"
                      }
                      size="small"
                      sx={{
                        height: {
                          xs: "24px",
                          sm: "26px",
                        },
                        fontFamily: '"Manrope", sans-serif',
                        fontSize: {
                          xs: "10px",
                          sm: "11px",
                        },
                      }}
                    />

                    <Chip
                      label={`Uploaded ${new Date(
                        resume.uploadedAt
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}`}
                      size="small"
                      sx={{
                        height: {
                          xs: "24px",
                          sm: "26px",
                        },
                        maxWidth: "100%",
                        fontFamily: '"Manrope", sans-serif',
                        fontSize: {
                          xs: "10px",
                          sm: "11px",
                        },
                        "& .MuiChip-label": {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Resume Actions */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                  flexShrink: 0,
                  alignItems: "stretch",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<VisibilityOutlinedIcon />}
                  onClick={handleViewResume}
                  disabled={viewing}
                  sx={{
                    flex: {
                      xs: 1,
                      sm: "initial",
                    },
                    minWidth: {
                      xs: 0,
                      sm: "150px",
                    },
                    minHeight: {
                      xs: "42px",
                      sm: "40px",
                    },
                    px: {
                      xs: 1.2,
                      sm: 2,
                    },
                    borderRadius: "9px",
                    textTransform: "none",
                    fontFamily: '"Manrope", sans-serif',
                    fontSize: {
                      xs: "12px",
                      sm: "13px",
                    },
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {viewing ? "Opening..." : "View Resume"}
                </Button>

                <IconButton
                  onClick={fetchResume}
                  disabled={loading}
                  sx={{
                    width: {
                      xs: "42px",
                      sm: "40px",
                    },
                    height: {
                      xs: "42px",
                      sm: "40px",
                    },
                    flexShrink: 0,
                    border: "1px solid #dce3ed",
                    borderRadius: "9px",
                  }}
                >
                  <RefreshIcon
                    sx={{
                      fontSize: {
                        xs: 20,
                        sm: 21,
                      },
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ) : (
          /* Empty Resume State */
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#fff",
              border: "1px solid #e4e9f1",
              borderRadius: {
                xs: "14px",
                sm: "16px",
              },
              p: {
                xs: "28px 18px",
                sm: 4,
                md: 6,
              },
              textAlign: "center",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <Avatar
              sx={{
                width: {
                  xs: 62,
                  sm: 72,
                },
                height: {
                  xs: 62,
                  sm: 72,
                },
                mx: "auto",
                mb: 2,
                backgroundColor: "#edf4ff",
                color: "#1677e8",
              }}
            >
              <CloudUploadOutlinedIcon
                sx={{
                  fontSize: {
                    xs: 29,
                    sm: 34,
                  },
                }}
              />
            </Avatar>

            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "18px",
                  sm: "20px",
                },
                lineHeight: 1.3,
                fontWeight: 800,
                color: "#172b4d",
              }}
            >
              No resume uploaded
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#7890ae",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },
                lineHeight: 1.6,
                maxWidth: "520px",
                mx: "auto",
              }}
            >
              Upload your latest resume in PDF or DOCX format. Your resume
              will be processed and stored securely for use during your
              interview preparation.
            </Typography>

            <Button
              variant="contained"
              startIcon={<CloudUploadOutlinedIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                mt: 3,
                minHeight: "44px",
                textTransform: "none",
                borderRadius: "10px",
                px: 2.5,
                py: 1.3,
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "13px",
                  sm: "14px",
                },
                fontWeight: 700,
                backgroundColor: "#1677e8",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#1269d2",
                  boxShadow: "none",
                },
              }}
            >
              Upload Resume
            </Button>

            <Typography
              sx={{
                mt: 1.5,
                color: "#9aabc0",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "11px",
                  sm: "12px",
                },
              }}
            >
              Supported formats: PDF, DOCX
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResumePage;