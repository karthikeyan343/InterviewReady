import React, { useEffect, useRef, useState } from "react";
import { Box, Container, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/LogoIR.png";
import { useServerWakeup } from "../../../../context/ServerWakeupContext";
import MobileNavDrawer from "../MobileNavDrawer";
import { WakeupDialog } from "./components/WakeupDialog";
import { DesktopNavLinks } from "./components/DesktopNavLinks";
import { DesktopAuthButtons } from "./components/DesktopAuthButtons";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { status, ensureReady, retry } = useServerWakeup();

  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("#home");

  const lastScrollYRef = useRef(0);
  const isVisibleRef = useRef(true);

  // Popup state: null = closed, "/login" | "/register" = pending destination
  const [pendingDest, setPendingDest] = useState<string | null>(null);
  const [popupError, setPopupError] = useState(false);

  // Dynamic tracking of active landing page section
  useEffect(() => {
    const sectionIds = ["home", "features", "how-it-works", "about-us"];

    const handleActiveScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      if (scrollY < 120) {
        setActiveSection("#home");
        return;
      }

      if (
        window.innerHeight + scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        setActiveSection("#about-us");
        return;
      }

      let current = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportHeight * 0.45 && rect.bottom >= 80) {
          current = id;
        }
      }
      setActiveSection(`#${current}`);
    };

    window.addEventListener("scroll", handleActiveScroll, { passive: true });
    handleActiveScroll();

    return () => {
      window.removeEventListener("scroll", handleActiveScroll);
    };
  }, []);

  useEffect(() => {
    const SCROLL_THRESHOLD = 8;

    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);

      // 1. Floating pill styling (after initial 30px)
      setScrolled(currentScrollY > 30);

      // 2. Measure hero section boundary
      const heroEl = document.getElementById("home");
      const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;
      const heroThreshold = Math.max(100, heroHeight - 80);

      const deltaY = currentScrollY - lastScrollYRef.current;

      // 3. If within or above hero boundary, navbar is always visible
      if (currentScrollY <= heroThreshold) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
        lastScrollYRef.current = currentScrollY;
        return;
      }

      // 4. Past hero boundary: ignore tiny trackpad / mousewheel jitters
      if (Math.abs(deltaY) < SCROLL_THRESHOLD) {
        return;
      }

      // 5. Scroll direction handling past the hero
      if (deltaY > 0) {
        // Scrolling DOWN past hero -> smoothly hide
        if (isVisibleRef.current) {
          isVisibleRef.current = false;
          setIsVisible(false);
        }
      } else {
        // Scrolling UP anywhere on the page -> smoothly reveal
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setActiveSection(href);
    setMobileOpen(false);

    if (href.startsWith("#")) {
      const element = document.querySelector(href);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  const handleAuthNav = (destination: string) => {
    setMobileOpen(false);

    if (status === "ready") {
      navigate(destination);
      return;
    }

    setPopupError(status === "failed");
    setPendingDest(destination);

    ensureReady()
      .then(() => {
        setPendingDest(null);
        navigate(destination);
      })
      .catch(() => {
        setPopupError(true);
      });
  };

  const handleRetry = () => {
    setPopupError(false);
    retry()
      .then(() => {
        if (pendingDest) {
          const dest = pendingDest;
          setPendingDest(null);
          navigate(dest);
        }
      })
      .catch(() => {
        setPopupError(true);
      });
  };

  const handleClosePopup = () => {
    setPendingDest(null);
    setPopupError(false);
  };

  return (
    <>
      <WakeupDialog
        open={pendingDest !== null}
        popupError={popupError}
        onClose={handleClosePopup}
        onRetry={handleRetry}
      />

      <Box
        component="nav"
        sx={{
          position: "fixed",
          zIndex: 1200,
          top: {
            xs: scrolled ? "10px" : 0,
            md: scrolled ? "14px" : 0,
          },
          left: "50%",
          transform: isVisible || mobileOpen
            ? "translate(-50%, 0)"
            : "translate(-50%, -140%)",
          pointerEvents: isVisible || mobileOpen ? "auto" : "none",
          width: {
            xs: scrolled ? "calc(100% - 20px)" : "100%",
            md: scrolled ? "calc(100% - 48px)" : "100%",
          },
          maxWidth: {
            xs: "none",
            md: scrolled ? "1240px" : "none",
          },
          borderRadius: {
            xs: scrolled ? "10px" : 0,
            md: scrolled ? "8px" : 0,
          },
          backgroundColor: scrolled
            ? "rgba(255, 255, 255, 0.96)"
            : "transparent",
          border: scrolled
            ? "1.5px solid rgba(220, 226, 239, 0.9)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 10px 35px rgba(20, 35, 70, 0.10)"
            : "none",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          transition:
            "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), top 0.3s ease, width 0.3s ease, max-width 0.3s ease, border-radius 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
          fontFamily: '"Manrope", sans-serif',
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            height: {
              xs: "68px",
              md: scrolled ? "68px" : "82px",
            },
            maxWidth: scrolled ? "none" : "1400px",
            mx: "auto",
            px: {
              xs: 2,
              sm: 3,
              md: 3,
              lg: 4,
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "height 0.3s ease",
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="InterviewReady"
              sx={{
                width: {
                  xs: "155px",
                  sm: "175px",
                  md: "200px",
                },
                height: "auto",
                display: "block",
              }}
            />
          </Box>

          {/* Desktop nav links */}
          <DesktopNavLinks onNavClick={handleNavClick} />

          {/* Desktop auth buttons */}
          <DesktopAuthButtons onAuthNav={handleAuthNav} />

          {/* Mobile hamburger */}
          <IconButton
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },
              color: "#17203f",
              borderRadius: "10px",
            }}
          >
            <MenuIcon />
          </IconButton>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeSection={activeSection}
        onNavClick={handleNavClick}
        onAuthNav={handleAuthNav}
      />
    </>
  );
};

export default Navbar;
