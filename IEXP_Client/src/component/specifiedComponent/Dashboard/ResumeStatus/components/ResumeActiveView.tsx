import React from "react";
import { Box, Button, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface ResumeActiveViewProps {
  originalFileName: string;
  uploadedAt: string;
  uploading: boolean;
  formatDate: (date: string) => string;
  onViewResume: () => void;
  onUploadClick: () => void;
}

export const ResumeActiveView: React.FC<ResumeActiveViewProps> = ({
  originalFileName,
  uploadedAt,
  uploading,
  formatDate,
  onViewResume,
  onUploadClick,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        flexWrap: "wrap",
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
            maxWidth: { xs: "100%", sm: "280px" },
          }}
        >
          {originalFileName}
        </Typography>

        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: 500,
            color: "#7a8497",
            mt: "6px",
            whiteSpace: "nowrap",
          }}
        >
          Uploaded on {formatDate(uploadedAt)}
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
          flexWrap: "wrap",
          mt: { xs: 1, sm: 0 },
        }}
      >
        <Button
          variant="outlined"
          onClick={onViewResume}
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
          onClick={onUploadClick}
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
          {uploading ? "Validating resume..." : "Replace Resume"}
        </Button>
      </Box>
    </Box>
  );
};

export default ResumeActiveView;
