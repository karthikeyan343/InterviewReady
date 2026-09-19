import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../component/specifiedComponent/Dashboard/DashboardNavbar";

interface User {
  _id?: string;
  name?: string;
  email?: string;
}

interface DashboardData {
  stats?: {
    totalInterviews?: number;
    completedInterviews?: number;
    averageScore?: number;
  };

  resume?: {
    uploaded?: boolean;
  };
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch (error) {
        console.error("Unable to read stored user:", error);
      }
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/interviews/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data.");
        }

        const data: DashboardData = await response.json();

        setDashboardData(data);
      } catch (error) {
        console.error("Profile data error:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchProfileData();
  }, [navigate]);

  const displayName = user?.name?.trim() || "User";

  const email = user?.email?.trim() || "Email not available";

  const initials = useMemo(() => {
    const parts = displayName
      .split(" ")
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${
      parts[parts.length - 1][0]
    }`.toUpperCase();
  }, [displayName]);

  const totalInterviews =
    dashboardData?.stats?.totalInterviews ?? 0;

  const completedInterviews =
    dashboardData?.stats?.completedInterviews ?? 0;

  const averageScore =
    dashboardData?.stats?.averageScore ?? 0;

  const resumeUploaded =
    dashboardData?.resume?.uploaded ?? false;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F6F8FC",
        color: "#172B4D",
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      

      <DashboardNavbar/>
      

      <Box
        sx={{
          width: "100%",
          maxWidth: "1180px",
          mx: "auto",
          px: {
            xs: "20px",
            sm: "30px",
            md: "0px",
          },
          py: {
            xs: "30px",
            md: "46px",
          },
        }}
      >
        

        <Box
          sx={{
            mb: "28px",
          }}
        >
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.8px",
              color: "#8A9BB7",
              textTransform: "uppercase",
              mb: "6px",
            }}
          >
            ACCOUNT
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: "28px",
                md: "34px",
              },
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "#101B46",
              lineHeight: 1.2,
            }}
          >
            Profile
          </Typography>

          <Typography
            sx={{
              mt: "7px",
              fontSize: "13px",
              color: "#7182A8",
            }}
          >
            Manage your account information and interview progress.
          </Typography>
        </Box>



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
          boxShadow:
            "0 5px 18px rgba(30,55,95,0.12)",
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

        

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.35fr 0.65fr",
            },
            gap: "24px",
          }}
        >
          

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
                onClick={() => navigate("/resume")}
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
              Your progress
            </Typography>

            <Typography
              sx={{
                mt: "5px",
                mb: "24px",
                fontSize: "12px",
                color: "#7182A8",
              }}
            >
              Your current interview activity.
            </Typography>

            {loading ? (
              <Box
                sx={{
                  minHeight: "220px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress
                  size={26}
                  sx={{
                    color: "#1769E8",
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                

                <Box
                  sx={{
                    border: "1px solid #E6EBF2",
                    borderRadius: "11px",
                    p: "16px",
                  }}
                >
                  <WorkOutlineOutlinedIcon
                    sx={{
                      fontSize: "19px",
                      color: "#1769E8",
                      mb: "9px",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#101B46",
                    }}
                  >
                    {totalInterviews}
                  </Typography>

                  <Typography
                    sx={{
                      mt: "2px",
                      fontSize: "10px",
                      color: "#7182A8",
                    }}
                  >
                    Total interviews
                  </Typography>
                </Box>

                

                <Box
                  sx={{
                    border: "1px solid #E6EBF2",
                    borderRadius: "11px",
                    p: "16px",
                  }}
                >
                  <CheckCircleOutlineOutlinedIcon
                    sx={{
                      fontSize: "19px",
                      color: "#36A56C",
                      mb: "9px",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#101B46",
                    }}
                  >
                    {completedInterviews}
                  </Typography>

                  <Typography
                    sx={{
                      mt: "2px",
                      fontSize: "10px",
                      color: "#7182A8",
                    }}
                  >
                    Completed
                  </Typography>
                </Box>

                

                <Box
                  sx={{
                    border: "1px solid #E6EBF2",
                    borderRadius: "11px",
                    p: "16px",
                  }}
                >
                  <TrendingUpOutlinedIcon
                    sx={{
                      fontSize: "19px",
                      color: "#7656D8",
                      mb: "9px",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#101B46",
                    }}
                  >
                    {averageScore}%
                  </Typography>

                  <Typography
                    sx={{
                      mt: "2px",
                      fontSize: "10px",
                      color: "#7182A8",
                    }}
                  >
                    Average score
                  </Typography>
                </Box>

                

                <Box
                  sx={{
                    border: "1px solid #E6EBF2",
                    borderRadius: "11px",
                    p: "16px",
                  }}
                >
                  <DescriptionOutlinedIcon
                    sx={{
                      fontSize: "19px",
                      color: "#E19A3E",
                      mb: "9px",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#101B46",
                    }}
                  >
                    {resumeUploaded ? "Ready" : "Pending"}
                  </Typography>

                  <Typography
                    sx={{
                      mt: "4px",
                      fontSize: "10px",
                      color: "#7182A8",
                    }}
                  >
                    Resume status
                  </Typography>
                </Box>
              </Box>
            )}

            <Button
              onClick={() => navigate("/reports")}
              fullWidth
              sx={{
                mt: "18px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "#1769E8",
                color: "#FFFFFF",
                textTransform: "none",
                fontSize: "11px",
                fontWeight: 700,
                "&:hover": {
                  backgroundColor: "#0D5FD1",
                },
              }}
            >
              View reports
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;