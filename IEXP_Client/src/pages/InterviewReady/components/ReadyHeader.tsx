import React from "react";
import { Box, Typography } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";

interface ReadyHeaderProps {
  id?: string;
}

export const ReadyHeader: React.FC<ReadyHeaderProps> = ({ id }) => {
  return (
    <Box
      sx={{
        px: { xs: "14px", sm: "24px" },
        py: { xs: "12px", sm: "16px" },
        borderBottom: "1px solid #262a32",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: { xs: "32px", sm: "34px" },
            height: { xs: "32px", sm: "34px" },
            borderRadius: "8px",
            backgroundColor: "#356ae6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <SmartToyIcon
            sx={{
              fontSize: { xs: "17px", sm: "19px" },
              color: "#ffffff",
            }}
          />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: { xs: "12px", sm: "13px" },
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            InterviewReady
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "9px", sm: "10px" },
              color: "#858b98",
              mt: "1px",
              whiteSpace: "nowrap",
            }}
          >
            AI Interview Room
          </Typography>
        </Box>
      </Box>

      {id && (
        <Typography
          sx={{
            display: { xs: "none", sm: "block" },
            fontSize: "10px",
            color: "#7e8796",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
          title={id}
        >
          ID: {id}
        </Typography>
      )}
    </Box>
  );
};

export default ReadyHeader;
