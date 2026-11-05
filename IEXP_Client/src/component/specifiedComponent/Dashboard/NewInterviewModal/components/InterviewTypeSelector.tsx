import React from "react";
import { Box, Button, Typography } from "@mui/material";
import type { InterviewType } from "../types";

interface InterviewTypeSelectorProps {
  interviewType: InterviewType;
  onSelectType: (type: InterviewType) => void;
}

const TYPES: InterviewType[] = ["Technical", "Resume-Based", "Mixed"];

export const InterviewTypeSelector: React.FC<InterviewTypeSelectorProps> = ({
  interviewType,
  onSelectType,
}) => {
  return (
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
        {TYPES.map((type) => (
          <Button
            key={type}
            onClick={() => onSelectType(type)}
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
              borderColor: interviewType === type ? "#356ae6" : "#dfe4ec",
              color: interviewType === type ? "#356ae6" : "#697386",
              backgroundColor: interviewType === type ? "#f4f7ff" : "#ffffff",
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
  );
};

export default InterviewTypeSelector;
