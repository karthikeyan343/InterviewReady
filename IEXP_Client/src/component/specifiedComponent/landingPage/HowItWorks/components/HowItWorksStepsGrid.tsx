import React from "react";
import { Box, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { steps } from "../howItWorksConfig";

export const HowItWorksStepsGrid: React.FC = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
        columnGap: {
          xs: 3,
          md: 2,
          lg: 3,
        },
        rowGap: {
          xs: 4,
          sm: 5,
          md: 0,
        },
        mb: {
          xs: 7,
          md: 9,
        },
      }}
    >
      {steps.map((step, index) => (
        <Box
          key={step.number}
          sx={{
            position: "relative",
            display: "flex",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            flexDirection: {
              xs: "row",
              md: "column",
            },
            textAlign: {
              xs: "left",
              md: "center",
            },
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              position: "relative",
              flexShrink: 0,
              width: {
                xs: 52,
                md: 56,
              },
              height: {
                xs: 52,
                md: 56,
              },
              mr: {
                xs: 2,
                md: 0,
              },
              mb: {
                xs: 0,
                md: 1.8,
              },
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#eef4ff",
              color: "#2176e8",
              border: "1px solid #dce8ff",
              "& svg": {
                fontSize: {
                  xs: 23,
                  md: 26,
                },
              },
            }}
          >
            {step.icon}
            <Box
              sx={{
                position: "absolute",
                top: {
                  xs: -5,
                  md: -6,
                },
                left: {
                  xs: -5,
                  md: -6,
                },
                width: 20,
                height: 20,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#1769e0",
                color: "#ffffff",
                fontFamily: '"Manrope", sans-serif',
                fontSize: "10px",
                fontWeight: 700,
                border: "2px solid #ffffff",
              }}
            >
              {step.number}
            </Box>
          </Box>

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              component="h3"
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "15px",
                  sm: "15px",
                  md: "15px",
                },
                lineHeight: 1.4,
                fontWeight: 700,
                color: "#17203f",
                mb: 0.6,
              }}
            >
              {step.title}
            </Typography>

            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "12px",
                  sm: "12px",
                  md: "12px",
                },
                lineHeight: 1.55,
                fontWeight: 400,
                color: "#7885a4",
                maxWidth: {
                  xs: "none",
                  md: "190px",
                },
                mx: {
                  xs: 0,
                  md: "auto",
                },
              }}
            >
              {step.description}
            </Typography>
          </Box>

          {index < steps.length - 1 && (
            <ArrowForwardRoundedIcon
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
                position: "absolute",
                top: "24px",
                right: {
                  md: "-18px",
                  lg: "-24px",
                },
                fontSize: 22,
                color: "#60749d",
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default HowItWorksStepsGrid;
