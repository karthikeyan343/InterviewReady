import React from "react";
import { Box, Button, Typography } from "@mui/material";
import type { DifficultyLevel } from "../types";

interface DifficultySelectorProps {
  difficulty: DifficultyLevel;
  onSelectDifficulty: (level: DifficultyLevel) => void;
}

const LEVELS: DifficultyLevel[] = ["Easy", "Medium", "Hard"];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  onSelectDifficulty,
}) => {
  return (
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
        {LEVELS.map((level) => (
          <Button
            key={level}
            onClick={() => onSelectDifficulty(level)}
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
              borderColor: difficulty === level ? "#356ae6" : "#dfe4ec",
              color: difficulty === level ? "#356ae6" : "#697386",
              backgroundColor: difficulty === level ? "#f4f7ff" : "#ffffff",
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
        ))}
      </Box>
    </Box>
  );
};

export default DifficultySelector;
