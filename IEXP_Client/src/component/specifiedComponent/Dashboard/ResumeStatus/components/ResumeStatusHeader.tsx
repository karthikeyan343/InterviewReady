import React from "react";
import { Box, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";

interface ResumeStatusHeaderProps {
  hasResume: boolean;
}

export const ResumeStatusHeader: React.FC<ResumeStatusHeaderProps> = ({
  hasResume,
}) => {
  return (
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
        {hasResume ? (
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
  );
};

export default ResumeStatusHeader;
