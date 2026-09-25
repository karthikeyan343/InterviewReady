import React, {
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useResume, invalidateResume } from "../../../services/apiQueries";

const ResumeStatusCard: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data, isLoading: loading } = useResume();
  const resume = data?.resume ?? null;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleViewResume = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Authentication required. Please login again."
        );
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/resume/view`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to open resume"
        );
      }

      window.open(
        result.url,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error(
        "View resume error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to open resume"
      );
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    const isPdf =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    const isDocx =
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name
        .toLowerCase()
        .endsWith(".docx");

    if (!isPdf && !isDocx) {
      setError(
        "Only PDF and DOCX files are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "File size must be less than 5 MB."
      );

      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Authentication required. Please login again."
        );
        return;
      }

      const formData = new FormData();

      formData.append("resume", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/resume/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to upload resume"
        );
      }

      invalidateResume();
    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload resume"
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

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
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        style={{
          display: "none",
        }}
      />
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
            Your Resume
          </Typography>

          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#7a8497",
              mt: "4px",
            }}
          >
            Manage your interview resume
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
          {resume ? (
            <DescriptionOutlinedIcon
              sx={{
                fontSize: "20px",
              }}
            />
          ) : (
            <UploadFileOutlinedIcon
              sx={{
                fontSize: "20px",
              }}
            />
          )}
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
            mb: "14px",
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

      {resume ? (
        /* Resume Uploaded */
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
              {resume.originalFileName}
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 500,
                color: "#7a8497",
                mt: "6px",
              }}
            >
              Uploaded on{" "}
              {formatDate(resume.uploadedAt)}
            </Typography>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                mt: "9px",
                px: "8px",
                py: "4px",
                borderRadius: "6px",
                backgroundColor: "#edf8f1",
              }}
            >
              <CheckCircleIcon
                sx={{
                  fontSize: "12px",
                  color: "#21874b",
                }}
              />

              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#21874b",
                }}
              >
                Ready
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleViewResume}
              sx={{
                height: "38px",
                px: "14px",
                borderRadius: "9px",
                textTransform: "none",
                fontFamily: '"Manrope", sans-serif',
                fontSize: "11px",
                fontWeight: 700,
                borderColor: "#dce2ec",
                color: "#356ae6",
                "&:hover": {
                  borderColor: "#356ae6",
                  backgroundColor: "#f7f9ff",
                },
              }}
            >
              View Resume
            </Button>

            <Button
              variant="outlined"
              onClick={handleUploadClick}
              disabled={uploading}
              sx={{
                height: "38px",
                px: "14px",
                borderRadius: "9px",
                textTransform: "none",
                fontFamily: '"Manrope", sans-serif',
                fontSize: "11px",
                fontWeight: 700,
                borderColor: "#dce2ec",
                color: "#356ae6",
                "&:hover": {
                  borderColor: "#356ae6",
                  backgroundColor: "#f7f9ff",
                },
              }}
            >
              {uploading
                ? "Uploading..."
                : "Replace Resume"}
            </Button>
          </Box>
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
              No resume uploaded
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 500,
                color: "#7a8497",
                mt: "5px",
              }}
            >
              Upload your resume to start
              AI-powered interviews.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handleUploadClick}
            disabled={uploading}
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
            {uploading
              ? "Uploading..."
              : "Upload Resume"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ResumeStatusCard;