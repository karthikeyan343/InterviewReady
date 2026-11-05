import React from "react";
import { Box, Checkbox, Typography } from "@mui/material";

interface TermsAgreementProps {
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}

export const TermsAgreement: React.FC<TermsAgreementProps> = ({
  checked,
  disabled,
  onChange,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",

        mb: {
          xs: "9px",
          sm: "11px",
          md: "13px",
        },

        ml: {
          xs: "-2px",
          sm: "-3px",
          md: "-4px",
        },

        minWidth: 0,
      }}
    >
      <Checkbox
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        size="small"
        disabled={disabled}
        sx={{
          p: 0,
          mr: "5px",
          mt: "0px",
          color: "#a9b8cc",

          "&.Mui-checked": {
            color: "#1769e8",
          },
        }}
      />

      <Typography
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "9px",
            sm: "10px",
            md: "11px",
          },
          lineHeight: 1.4,
          fontWeight: 500,
          color: "#7182a8",
          mt: "1.5px",
        }}
      >
        I agree to the{" "}
        <Typography
          component="a"
          href="#"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: "inherit",
            fontWeight: 700,
            color: "#1769e8",
            textDecoration: "none",

            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Terms of Service
        </Typography>{" "}
        and{" "}
        <Typography
          component="a"
          href="#"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: "inherit",
            fontWeight: 700,
            color: "#1769e8",
            textDecoration: "none",

            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Privacy Policy
        </Typography>
      </Typography>
    </Box>
  );
};
