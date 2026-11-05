import React from "react";
import { Box, Container } from "@mui/material";
import { companyLinks, legalLinks, productLinks } from "./footerConfig";
import FooterBrand from "./components/FooterBrand";
import FooterLinksColumn from "./components/FooterLinksColumn";
import FooterSocialLinks from "./components/FooterSocialLinks";
import FooterCopyright from "./components/FooterCopyright";

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e5eaf2",
        fontFamily: '"Manrope", sans-serif',
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
          pt: {
            xs: 4,
            sm: 6,
            md: 6,
          },
          pb: {
            xs: 2.5,
            sm: 3,
          },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "1.6fr 1fr 1fr 1fr 1fr",
              md: "1.8fr 1fr 1fr 1fr 1fr",
            },
            columnGap: {
              xs: 3,
              sm: 3,
              md: 5,
              lg: 6,
            },
            rowGap: {
              xs: 3.5,
              sm: 0,
            },
          }}
        >
          <FooterBrand />
          <FooterLinksColumn title="Product" links={productLinks} />
          <FooterLinksColumn title="Company" links={companyLinks} />
          <FooterLinksColumn title="Legal" links={legalLinks} />
          <FooterSocialLinks />
        </Box>

        <FooterCopyright />
      </Container>
    </Box>
  );
};

export default Footer;
