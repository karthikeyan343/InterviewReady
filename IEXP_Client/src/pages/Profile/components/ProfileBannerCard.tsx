import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

interface ProfileBannerCardProps {
  initials: string;
  displayName: string;
  email: string;
}

export const ProfileBannerCard: React.FC<ProfileBannerCardProps> = ({
  initials,
  displayName,
  email,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E4E9F1",
        borderRadius: "16px",
        overflow: "hidden",
        mb: "24px",
      }}
    >
      <Box
        sx={{
          height: {
            xs: "105px",
            md: "135px",
          },
          background:
            "linear-gradient(115deg, #EAF2FF 0%, #F4F1FF 55%, #EDF6FF 100%)",
        }}
      />

      <Box
        sx={{
          px: {
            xs: "22px",
            md: "34px",
          },
          pb: "28px",
        }}
      >
        <Box
          sx={{
            mt: "-42px",
            mb: "18px",
          }}
        >
          <Avatar
            sx={{
              width: "84px",
              height: "84px",
              border: "5px solid #FFFFFF",
              backgroundColor: "#6A4E45",
              fontSize: "25px",
              fontWeight: 800,
              boxShadow: "0 5px 18px rgba(30,55,95,0.12)",
            }}
          >
            {initials}
          </Avatar>
        </Box>

        <Typography
          sx={{
            fontSize: {
              xs: "23px",
              md: "26px",
            },
            fontWeight: 800,
            color: "#101B46",
          }}
        >
          {displayName}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            mt: "7px",
          }}
        >
          <EmailOutlinedIcon
            sx={{
              fontSize: "16px",
              color: "#8A9BB7",
            }}
          />

          <Typography
            sx={{
              fontSize: "12px",
              color: "#7182A8",
              overflowWrap: "anywhere",
            }}
          >
            {email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileBannerCard;
