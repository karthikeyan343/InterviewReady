import React from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

interface AccountDetailsCardProps {
  displayName: string;
  email: string;
  resumeUploaded: boolean;
  onNavigateResume: () => void;
}

export const AccountDetailsCard: React.FC<AccountDetailsCardProps> = ({
  displayName,
  email,
  resumeUploaded,
  onNavigateResume,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E4E9F1",
        borderRadius: "16px",
        p: {
          xs: "22px",
          md: "30px",
        },
      }}
    >
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 800,
          color: "#101B46",
        }}
      >
        Account details
      </Typography>

      <Typography
        sx={{
          mt: "5px",
          mb: "24px",
          fontSize: "12px",
          color: "#7182A8",
        }}
      >
        Your account information currently available in InterviewReady.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },
          gap: "14px",
        }}
      >
        <Box
          sx={{
            border: "1px solid #E6EBF2",
            borderRadius: "11px",
            p: "17px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              mb: "10px",
            }}
          >
            <PersonOutlineOutlinedIcon
              sx={{
                fontSize: "18px",
                color: "#1769E8",
              }}
            />

            <Typography
              sx={{
                fontSize: "10px",
                fontWeight: 800,
                color: "#8A9BB7",
                letterSpacing: "0.4px",
              }}
            >
              FULL NAME
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#172B4D",
            }}
          >
            {displayName}
          </Typography>
        </Box>

        <Box
          sx={{
            border: "1px solid #E6EBF2",
            borderRadius: "11px",
            p: "17px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              mb: "10px",
            }}
          >
            <EmailOutlinedIcon
              sx={{
                fontSize: "18px",
                color: "#1769E8",
              }}
            />

            <Typography
              sx={{
                fontSize: "10px",
                fontWeight: 800,
                color: "#8A9BB7",
                letterSpacing: "0.4px",
              }}
            >
              EMAIL ADDRESS
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#172B4D",
              overflowWrap: "anywhere",
            }}
          >
            {email}
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{
          my: "24px",
          borderColor: "#EDF0F5",
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "15px",
          p: "15px",
          borderRadius: "11px",
          backgroundColor: "#F7FAFF",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Box
            sx={{
              width: "38px",
              height: "38px",
              borderRadius: "9px",
              backgroundColor: "#EAF2FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DescriptionOutlinedIcon
              sx={{
                fontSize: "20px",
                color: "#1769E8",
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 800,
                color: "#172B4D",
              }}
            >
              Resume
            </Typography>

            <Typography
              sx={{
                fontSize: "10px",
                color: "#7182A8",
                mt: "2px",
              }}
            >
              {resumeUploaded
                ? "Your resume is uploaded"
                : "Your resume has not been uploaded"}
            </Typography>
          </Box>
        </Box>

        <Button
          onClick={onNavigateResume}
          endIcon={
            <ArrowForwardIosOutlinedIcon
              sx={{
                fontSize: "10px !important",
              }}
            />
          }
          sx={{
            minWidth: "auto",
            px: "8px",
            textTransform: "none",
            color: "#1769E8",
            fontSize: "11px",
            fontWeight: 700,
          }}
        >
          View
        </Button>
      </Box>
    </Box>
  );
};

export default AccountDetailsCard;
