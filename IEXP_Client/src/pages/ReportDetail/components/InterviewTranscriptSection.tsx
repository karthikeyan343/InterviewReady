import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  Chip,
  Collapse,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { TranscriptTurnCard } from "./TranscriptTurnCard";
import {
  useInterviewTranscript,
  type InterviewReport,
  type ConversationTurn,
} from "../../../services/apiQueries";
import {
  exportReportToPdfPrint,
  generateReportMarkdown,
  downloadMarkdownFile,
} from "../services/reportExportService";

interface InterviewTranscriptSectionProps {
  interviewId: string;
  report: InterviewReport;
}

type FilterType = "all" | "questions" | "answers";

export const InterviewTranscriptSection: React.FC<InterviewTranscriptSectionProps> = ({
  interviewId,
  report,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const { data, isLoading, error } = useInterviewTranscript(
    interviewId,
    shouldFetch || isExpanded
  );

  const conversation: ConversationTurn[] = useMemo(
    () => data?.conversation || [],
    [data?.conversation]
  );

  const handleToggleExpand = () => {
    if (!isExpanded && !shouldFetch) {
      setShouldFetch(true);
    }
    setIsExpanded((prev) => !prev);
  };

  const handleDownloadPdf = () => {
    if (!shouldFetch) {
      setShouldFetch(true);
    }
    exportReportToPdfPrint({
      report,
      conversation,
    });
  };

  const handleDownloadMarkdown = () => {
    if (!shouldFetch) {
      setShouldFetch(true);
    }
    const md = generateReportMarkdown({
      report,
      conversation,
    });
    downloadMarkdownFile(md, `interview-report-${interviewId.slice(-6)}.md`);
  };

  const questionCount = useMemo(
    () => conversation.filter((t) => t.isQuestion).length,
    [conversation]
  );

  const filteredTurns = useMemo(() => {
    return conversation.filter((turn) => {
      if (filterType === "questions" && !turn.isQuestion) return false;
      if (filterType === "answers" && turn.speaker !== "candidate") return false;

      if (!searchQuery.trim()) return true;
      return turn.text.toLowerCase().includes(searchQuery.toLowerCase().trim());
    });
  }, [conversation, filterType, searchQuery]);

  return (
    <Box
      sx={{
        mt: 3,
        backgroundColor: "#FFFFFF",
        border: "1px solid #E3E9F2",
        borderRadius: 3,
        p: { xs: 2.5, md: 3.5 },
      }}
    >
      {/* Top Header Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              backgroundColor: "#EEF5FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1468F2",
            }}
          >
            <ForumOutlinedIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: { xs: 18, md: 20 }, fontWeight: 800, color: "#172B4D" }}>
              Interview Conversation Transcript
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#7185A3", mt: 0.3 }}>
              {isExpanded && conversation.length > 0
                ? `${questionCount} Questions asked &bull; ${conversation.length} Total conversation turns`
                : "Full chronological questions and candidate answers"}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons: Export & Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDownloadPdf}
            startIcon={<PictureAsPdfOutlinedIcon sx={{ fontSize: "17px" }} />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: "13px",
              borderColor: "#DCE6F6",
              color: "#1E293B",
              borderRadius: "8px",
              "&:hover": { borderColor: "#1468F2", backgroundColor: "#F0F6FF" },
            }}
          >
            Download PDF
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={handleDownloadMarkdown}
            startIcon={<DescriptionOutlinedIcon sx={{ fontSize: "17px" }} />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: "13px",
              borderColor: "#DCE6F6",
              color: "#1E293B",
              borderRadius: "8px",
              "&:hover": { borderColor: "#1468F2", backgroundColor: "#F0F6FF" },
            }}
          >
            Export .md
          </Button>

          <Button
            variant="contained"
            size="small"
            onClick={handleToggleExpand}
            endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: "13px",
              backgroundColor: "#1468F2",
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#0E52C6", boxShadow: "none" },
            }}
          >
            {isExpanded ? "Hide Transcript" : "View Transcript"}
          </Button>
        </Box>
      </Box>

      {/* Collapsible Content */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 3, pt: 2.5, borderTop: "1px solid #EEF2F6" }}>
          {isLoading ? (
            <Box sx={{ py: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1.5 }}>
              <CircularProgress size={32} sx={{ color: "#1468F2" }} />
              <Typography sx={{ fontSize: 14, color: "#64748B", fontWeight: 600 }}>
                Loading conversation transcript...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ py: 3, textAlign: "center" }}>
              <Typography sx={{ color: "#EF4444", fontSize: 14, fontWeight: 600 }}>
                {error instanceof Error ? error.message : "Failed to load conversation transcript."}
              </Typography>
            </Box>
          ) : conversation.length === 0 ? (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography sx={{ color: "#94A3B8", fontSize: 14 }}>
                No conversation turns recorded for this interview session.
              </Typography>
            </Box>
          ) : (
            <>
              {/* Search and Filters */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1.5,
                  mb: 2.5,
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search questions or responses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    width: { xs: "100%", sm: 280 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontSize: "13.5px",
                    },
                  }}
                />

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={`All (${conversation.length})`}
                    size="small"
                    clickable
                    onClick={() => setFilterType("all")}
                    sx={{
                      fontWeight: 700,
                      backgroundColor: filterType === "all" ? "#1468F2" : "#F1F5F9",
                      color: filterType === "all" ? "#FFFFFF" : "#475569",
                    }}
                  />
                  <Chip
                    label={`Questions (${questionCount})`}
                    size="small"
                    clickable
                    onClick={() => setFilterType("questions")}
                    sx={{
                      fontWeight: 700,
                      backgroundColor: filterType === "questions" ? "#1468F2" : "#F1F5F9",
                      color: filterType === "questions" ? "#FFFFFF" : "#475569",
                    }}
                  />
                  <Chip
                    label="Candidate Answers"
                    size="small"
                    clickable
                    onClick={() => setFilterType("answers")}
                    sx={{
                      fontWeight: 700,
                      backgroundColor: filterType === "answers" ? "#1468F2" : "#F1F5F9",
                      color: filterType === "answers" ? "#FFFFFF" : "#475569",
                    }}
                  />
                </Box>
              </Box>

              {/* Turns List */}
              {filteredTurns.length === 0 ? (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography sx={{ color: "#94A3B8", fontSize: 14 }}>
                    No speech turns matched your search filter.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mt: 1 }}>
                  {filteredTurns.map((turn) => (
                    <TranscriptTurnCard key={turn.id || `${turn.sequence}-${turn.speaker}`} turn={turn} />
                  ))}
                </Box>
              )}
            </>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};
