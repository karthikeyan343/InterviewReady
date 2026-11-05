import React from "react";
import { Box, Button } from "@mui/material";
import type { InterviewFilterType } from "../types";

interface InterviewsFilterButtonsProps {
  selectedFilter: InterviewFilterType;
  onSelectFilter: (filter: InterviewFilterType) => void;
}

const FILTERS: InterviewFilterType[] = ["All", "Completed", "Left"];

export const InterviewsFilterButtons: React.FC<InterviewsFilterButtonsProps> = ({
  selectedFilter,
  onSelectFilter,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mb: 2.5,
      }}
    >
      {FILTERS.map((filter) => {
        const isSelected = selectedFilter === filter;
        return (
          <Button
            key={filter}
            onClick={() => onSelectFilter(filter)}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              px: 2.2,
              py: 0.7,
              fontSize: 13,
              fontWeight: isSelected ? 700 : 600,
              backgroundColor: isSelected ? "#1677e8" : "#ffffff",
              color: isSelected ? "#ffffff" : "#52627f",
              border: isSelected ? "1px solid #1677e8" : "1px solid #e4e9f1",
              boxShadow: isSelected
                ? "0 2px 6px rgba(22, 119, 232, 0.2)"
                : "none",
              "&:hover": {
                backgroundColor: isSelected ? "#1264c7" : "#f4f7fc",
                borderColor: isSelected ? "#1264c7" : "#d0d7e2",
              },
            }}
          >
            {filter}
          </Button>
        );
      })}
    </Box>
  );
};

export default InterviewsFilterButtons;
