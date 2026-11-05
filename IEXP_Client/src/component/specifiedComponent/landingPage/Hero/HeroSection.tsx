import React from "react";
import { Box, Container } from "@mui/material";
import heroBgUnified from "../../../../assets/ModernTechConsultingHeroScene.png";
import { heroAnimations } from "./animations";
import { HeroPillBadge } from "./components/HeroPillBadge";
import { HeroHeading } from "./components/HeroHeading";
import { HeroActionButtons } from "./components/HeroActionButtons";
import { HeroMobileBadges } from "./components/HeroMobileBadges";
import { HeroFeatureHighlights } from "./components/HeroFeatureHighlights";
import { HeroFloatingCards } from "./components/HeroFloatingCards";

export const HeroSection: React.FC = () => {
  return (
    <Box
      id="home"
      component="section"
      sx={{
        position: "relative",
        width: "100%",
        boxSizing: "border-box",
        minHeight: { xs: "100vh", md: "100svh" },
        height: { md: "100svh" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "space-between",
        backgroundColor: "#FFFFFF",
        backgroundImage: {
          xs: `linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.55) 60%, rgba(255, 255, 255, 0.2) 100%), url(${heroBgUnified})`,
          md: `url(${heroBgUnified})`,
        },
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: {
          xs: "85% bottom",
          sm: "80% bottom",
          md: "right bottom",
        },
        fontFamily: '"Manrope", sans-serif',
        overflowX: "hidden",
        overflowY: { xs: "visible", md: "hidden" },
        pt: {
          xs: "84px",
          sm: "88px",
          md: "76px",
        },
        pb: {
          xs: "36px",
          sm: "44px",
          md: "24px",
        },
        "@media (max-height: 640px) and (min-width: 900px)": {
          minHeight: "640px",
          height: "auto",
        },
        ...heroAnimations,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1440px",
          mx: "auto",
          px: {
            xs: 2.5,
            sm: 4,
            md: 5,
            lg: 6,
          },
          height: {
            xs: "auto",
            md: "calc(100svh - 100px)",
          },
          minHeight: 0,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          justifyContent: "space-between",
          gap: { xs: 4, md: 0, lg: 1 },
        }}
      >
        {/* Left Column */}
        <Box
          sx={{
            width: {
              xs: "100%",
              md: "46%",
              lg: "45%",
              xl: "44%",
            },
            maxWidth: {
              xs: "100%",
              md: "580px",
              lg: "620px",
            },
            height: {
              xs: "auto",
              md: "100%",
            },
            boxSizing: "border-box",
            paddingTop: { md: "clamp(42px, 6.6vh, 50px)" },
            paddingBottom: { md: "clamp(48px, 9vh, 68px)" },
            display: "flex",
            flexDirection: "column",
            justifyContent: { xs: "flex-start", md: "space-between" },
            flexShrink: 0,
            zIndex: 3,
          }}
        >
          {/* Top Content Block: Badge, Heading, Subtitle, Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-evenly",
              width: "100%",
              height: "90%",
            }}
          >
            <HeroPillBadge />
            <HeroHeading />
            <HeroActionButtons />
          </Box>

          {/* ── Mobile Feature Badges (Screens < md) ── */}
          <HeroMobileBadges />

          {/* Bottom 3 Feature Highlights */}
          <HeroFeatureHighlights />
        </Box>

        {/* Right Column: Floating Artwork Stage */}
        <HeroFloatingCards />
      </Container>
    </Box>
  );
};

export default HeroSection;
