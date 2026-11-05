import React from "react";
import { Box, Container } from "@mui/material";
import HowItWorksHeader from "./components/HowItWorksHeader";
import HowItWorksStepsGrid from "./components/HowItWorksStepsGrid";
import HowItWorksBanner from "./components/HowItWorksBanner";

export const HowItWorksSection: React.FC = () => {
  return (
    <Box
      component="section"
      id="how-it-works"
      sx={{
        scrollMarginTop: { xs: "72px", md: "84px" },
        width: "100%",
        backgroundColor: "aliceblue",
        fontFamily: '"Manrope", sans-serif',
        overflow: "hidden",
        py: {
          xs: 3,
          sm: 4,
          md: 5,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },
        }}
      >
        <HowItWorksHeader />
        <HowItWorksStepsGrid />
        <HowItWorksBanner />
      </Container>
    </Box>
  );
};

export default HowItWorksSection;
