import React from "react";
import { Avatar, Box, Button, Chip, IconButton, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

interface ResumeData {
  originalFileName: string;
  fileType: string;
  uploadedAt: string;
}

interface ResumeCardProps {
  resume: ResumeData;
  viewing: boolean;
  loading: boolean;
  onViewResume: () => void;
  onRefresh: () => void;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  resume,
  viewing,
  loading,
  onViewResume,
  onRefresh,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        backgroundColor: "#fff",
        border: "1px solid #e4e9f1",
        borderRadius: {
          xs: "14px",
          sm: "16px",
        },
        p: {
          xs: "16px",
          sm: "20px",
          md: "24px",
        },
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          justifyContent: "space-between",
          gap: {
            xs: 2,
            md: 3,
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          minWidth: 0,
        }}
      >
        {/* Resume Information */}
        <Box
          sx={{
            width: {
              xs: "100%",
              md: "auto",
            },
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            gap: {
              xs: 1.5,
              sm: 2,
            },
            flex: 1,
          }}
        >
          <Avatar
            sx={{
              width: {
                xs: 46,
                sm: 54,
              },
              height: {
                xs: 46,
                sm: 54,
              },
              flexShrink: 0,
              backgroundColor: "#edf4ff",
              color: "#1677e8",
            }}
          >
            <DescriptionOutlinedIcon
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 26,
                },
              }}
            />
          </Avatar>

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
              width: "100%",
            }}
          >
            <Typography
              sx={{
                width: "100%",
                minWidth: 0,
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "14px",
                  sm: "16px",
                  md: "17px",
                },
                lineHeight: 1.4,
                fontWeight: 750,
                color: "#172b4d",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={resume.originalFileName}
            >
              {resume.originalFileName}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: {
                  xs: 0.6,
                  sm: 0.8,
                },
                mt: {
                  xs: 0.8,
                  sm: 1,
                },
                minWidth: 0,
              }}
            >
              <Chip
                label={resume.fileType.includes("pdf") ? "PDF" : "DOCX"}
                size="small"
                sx={{
                  height: {
                    xs: "24px",
                    sm: "26px",
                  },
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: {
                    xs: "10px",
                    sm: "11px",
                  },
                }}
              />

              <Chip
                label={`Uploaded ${new Date(resume.uploadedAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }
                )}`}
                size="small"
                sx={{
                  height: {
                    xs: "24px",
                    sm: "26px",
                  },
                  maxWidth: "100%",
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: {
                    xs: "10px",
                    sm: "11px",
                  },
                  "& .MuiChip-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Resume Actions */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            width: {
              xs: "100%",
              sm: "auto",
            },
            flexShrink: 0,
            alignItems: "stretch",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<VisibilityOutlinedIcon />}
            onClick={onViewResume}
            disabled={viewing}
            sx={{
              flex: {
                xs: 1,
                sm: "initial",
              },
              minWidth: {
                xs: 0,
                sm: "150px",
              },
              minHeight: {
                xs: "42px",
                sm: "40px",
              },
              px: {
                xs: 1.2,
                sm: 2,
              },
              borderRadius: "9px",
              textTransform: "none",
              fontFamily: '"Manrope", sans-serif',
              fontSize: {
                xs: "12px",
                sm: "13px",
              },
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {viewing ? "Opening..." : "View Resume"}
          </Button>

          <IconButton
            onClick={onRefresh}
            disabled={loading}
            sx={{
              width: {
                xs: "42px",
                sm: "40px",
              },
              height: {
                xs: "42px",
                sm: "40px",
              },
              flexShrink: 0,
              border: "1px solid #dce3ed",
              borderRadius: "9px",
            }}
          >
            <RefreshIcon
              sx={{
                fontSize: {
                  xs: 20,
                  sm: 21,
                },
              }}
            />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
export default ResumeCard;
