import React from "react";
import { Box, Typography } from "@mui/material";
import { featurePills } from "../types";

export const HeroFeatureHighlights: React.FC = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, max-content)",
        justifyContent: "start",
        alignItems: "center",
        columnGap: {
          xs: 0.8,
          sm: 1.2,
          md: 1.5,
        },
        rowGap: {
          xs: 1,
          sm: 1.2,
          md: 1.4,
        },
        width: "fit-content",
        maxWidth: "100%",
        mt: {
          xs: 2.2,
          sm: 2.8,
          md: 2,
        },
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      {featurePills.map((feature) => {
        const Icon = feature.Icon;
        const isLastPill = feature.id === "progress";

        return (
          <Box
            key={feature.id}
            sx={{
              gridColumn: isLastPill ? "1 / -1" : "auto",
              justifySelf: isLastPill ? "center" : "start",
              display: "inline-flex",
              alignItems: "center",
              gap: {
                xs: 0.75,
                sm: 1,
              },
              width: "fit-content",
              maxWidth: "100%",
              minWidth: 0,
              boxSizing: "border-box",
              px: {
                xs: 1,
                sm: 1.4,
                md: 1.5,
              },
              py: {
                xs: 0.75,
                sm: 0.9,
                md: 1,
              },
              borderRadius: "999px",
              backgroundColor: "rgba(255, 255, 255, 0.42)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: `
                0 6px 18px rgba(38, 89, 170, 0.09),
                inset 0 1px 0 rgba(255, 255, 255, 0.7)
              `,
              transition:
                "transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                backgroundColor: "rgba(255, 255, 255, 0.68)",
                boxShadow: "0 10px 24px rgba(38, 89, 170, 0.14)",
              },
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                width: {
                  xs: "30px",
                  sm: "34px",
                },
                height: {
                  xs: "30px",
                  sm: "34px",
                },
                minWidth: {
                  xs: "30px",
                  sm: "34px",
                },
                borderRadius: "10px",
                backgroundColor: feature.iconBackground,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon
                sx={{
                  fontSize: {
                    xs: "16px",
                    sm: "18px",
                  },
                  color: feature.color,
                }}
              />
            </Box>

            {/* Feature Text */}
            <Box
              sx={{
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 700,
                  fontSize: {
                    xs: "10px",
                    sm: "12px",
                  },
                  color: "#08194D",
                  lineHeight: 1.25,
                  whiteSpace: "nowrap",
                }}
              >
                {feature.title}
              </Typography>

              <Typography
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 500,
                  fontSize: {
                    xs: "9px",
                    sm: "11px",
                  },
                  color: "#5C6F96",
                  lineHeight: 1.25,
                  whiteSpace: "nowrap",
                }}
              >
                {feature.subtitle}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
