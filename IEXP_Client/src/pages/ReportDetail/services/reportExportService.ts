import type { InterviewReport, ConversationTurn } from "../../../services/apiQueries";

interface ExportReportOptions {
  report: InterviewReport;
  conversation?: ConversationTurn[];
  role?: string;
  difficulty?: string;
}

export function generateReportMarkdown({
  report,
  conversation = [],
  role = "Software Engineer",
  difficulty = "Medium",
}: ExportReportOptions): string {
  const dateStr = new Date(report.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let md = `# Interview Performance Report & Full Transcript\n\n`;
  md += `**Role:** ${role} | **Difficulty:** ${difficulty} | **Date:** ${dateStr}\n`;
  md += `**Overall Score:** ${report.overallScore}%\n\n`;

  md += `## Score Breakdown\n`;
  md += `- **Technical Score:** ${report.technicalScore}%\n`;
  md += `- **Communication Score:** ${report.communicationScore}%\n`;
  md += `- **Problem Solving Score:** ${report.problemSolvingScore}%\n\n`;

  md += `## AI Executive Summary\n${report.summary || "No summary provided."}\n\n`;

  md += `## Key Strengths\n`;
  if (report.strengths?.length) {
    report.strengths.forEach((s) => {
      md += `- ${s}\n`;
    });
  } else {
    md += `_No strengths recorded._\n`;
  }
  md += `\n`;

  md += `## Areas to Improve\n`;
  if (report.weaknesses?.length) {
    report.weaknesses.forEach((w) => {
      md += `- ${w}\n`;
    });
  } else {
    md += `_No areas to improve recorded._\n`;
  }
  md += `\n`;

  md += `## Suggestions for Improvement\n`;
  if (report.suggestions?.length) {
    report.suggestions.forEach((s, idx) => {
      md += `${idx + 1}. ${s}\n`;
    });
  } else {
    md += `_No suggestions recorded._\n`;
  }
  md += `\n`;

  md += `## Complete Interview Q&A Transcript\n\n`;
  if (conversation.length > 0) {
    conversation.forEach((turn) => {
      const speakerName = turn.speaker === "interviewer" ? "AI Interviewer" : "Candidate";
      const qPrefix = turn.isQuestion ? ` [Question #${turn.sequence}]` : "";
      const timeStr = new Date(turn.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      md += `### ${speakerName}${qPrefix} (${timeStr})\n`;
      md += `> ${turn.text.trim()}\n\n`;
    });
  } else {
    md += `_No conversation turns recorded for this session._\n`;
  }

  return md;
}

export function downloadMarkdownFile(content: string, filename = "interview-report.md"): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportReportToPdfPrint({
  report,
  conversation = [],
  role = "Software Engineer",
  difficulty = "Medium",
}: ExportReportOptions): void {
  const dateStr = new Date(report.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const printIframe = document.createElement("iframe");
  printIframe.style.position = "fixed";
  printIframe.style.right = "0";
  printIframe.style.bottom = "0";
  printIframe.style.width = "0";
  printIframe.style.height = "0";
  printIframe.style.border = "0";

  document.body.appendChild(printIframe);

  const turnsHtml = conversation.length > 0
    ? conversation
        .map((t) => {
          const isInterviewer = t.speaker === "interviewer";
          const speakerTitle = isInterviewer ? "AI Interviewer" : "Candidate (You)";
          const badgeClass = isInterviewer ? "badge-interviewer" : "badge-candidate";
          const cardClass = isInterviewer ? "turn-interviewer" : "turn-candidate";
          const time = new Date(t.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return `
            <div class="turn-card ${cardClass}">
              <div class="turn-header">
                <span class="badge ${badgeClass}">${speakerTitle}</span>
                ${t.isQuestion ? `<span class="q-seq">Question #${t.sequence}</span>` : ""}
                <span class="timestamp">${time}</span>
              </div>
              <div class="turn-text">${escapeHtml(t.text)}</div>
            </div>
          `;
        })
        .join("")
    : `<p class="empty-text">No conversation turns recorded for this interview session.</p>`;

  const strengthsHtml = report.strengths?.length
    ? report.strengths.map((s) => `<li>${escapeHtml(s)}</li>`).join("")
    : `<li>No specific strengths recorded.</li>`;

  const weaknessesHtml = report.weaknesses?.length
    ? report.weaknesses.map((w) => `<li>${escapeHtml(w)}</li>`).join("")
    : `<li>No specific areas to improve recorded.</li>`;

  const suggestionsHtml = report.suggestions?.length
    ? report.suggestions.map((s, idx) => `<li><strong>${idx + 1}.</strong> ${escapeHtml(s)}</li>`).join("")
    : `<li>No suggestions provided.</li>`;

  const htmlDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Interview Performance Report - ${escapeHtml(role)}</title>
        <style>
          @page { size: A4; margin: 16mm 14mm; }
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #172b4d;
            background: #ffffff;
            margin: 0;
            padding: 0;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .header {
            border-bottom: 2px solid #1468f2;
            padding-bottom: 12px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .title { font-size: 24px; font-weight: 800; color: #172b4d; margin: 0; }
          .subtitle { font-size: 13px; color: #5e6c84; margin-top: 4px; }
          .score-hero {
            background: #f0f6ff;
            border: 1px solid #cce0ff;
            border-radius: 10px;
            padding: 12px 18px;
            text-align: center;
          }
          .score-hero-val { font-size: 32px; font-weight: 800; color: #1468f2; line-height: 1; }
          .score-hero-lbl { font-size: 11px; font-weight: 700; color: #5e6c84; text-transform: uppercase; margin-top: 4px; }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          .metric-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 14px;
          }
          .metric-label { font-size: 12px; color: #64748b; font-weight: 600; }
          .metric-val { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 2px; }
          .section { margin-bottom: 22px; page-break-inside: avoid; }
          .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
            margin-bottom: 10px;
          }
          .summary-text { font-size: 13px; color: #334155; line-height: 1.6; }
          .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          ul { margin: 0; padding-left: 20px; font-size: 13px; color: #334155; }
          li { margin-bottom: 6px; line-height: 1.5; }
          .turn-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 10px;
            page-break-inside: avoid;
          }
          .turn-interviewer { background: #f8fafc; border-left: 4px solid #1468f2; }
          .turn-candidate { background: #ffffff; border-left: 4px solid #10b981; }
          .turn-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
          .badge {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 2px 7px;
            border-radius: 4px;
          }
          .badge-interviewer { background: #e0edff; color: #1468f2; }
          .badge-candidate { background: #dcfce7; color: #15803d; }
          .q-seq { font-size: 11px; font-weight: 700; color: #64748b; }
          .timestamp { font-size: 11px; color: #94a3b8; margin-left: auto; }
          .turn-text { font-size: 13px; color: #1e293b; line-height: 1.5; white-space: pre-wrap; }
          .empty-text { font-size: 13px; color: #94a3b8; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">Interview Performance & Transcript</h1>
            <div class="subtitle">Role: <strong>${escapeHtml(role)}</strong> &bull; Difficulty: <strong>${escapeHtml(difficulty)}</strong> &bull; Date: <strong>${escapeHtml(dateStr)}</strong></div>
          </div>
          <div class="score-hero">
            <div class="score-hero-val">${report.overallScore}%</div>
            <div class="score-hero-lbl">Overall Score</div>
          </div>
        </div>

        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-label">Technical Competence</div>
            <div class="metric-val">${report.technicalScore}%</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Communication Skills</div>
            <div class="metric-val">${report.communicationScore}%</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Problem Solving</div>
            <div class="metric-val">${report.problemSolvingScore}%</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Executive AI Summary</div>
          <div class="summary-text">${escapeHtml(report.summary || "No summary provided.")}</div>
        </div>

        <div class="section two-col">
          <div>
            <div class="section-title">Strengths</div>
            <ul>${strengthsHtml}</ul>
          </div>
          <div>
            <div class="section-title">Areas to Improve</div>
            <ul>${weaknessesHtml}</ul>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Actionable Recommendations</div>
          <ul style="list-style: none; padding-left: 0;">${suggestionsHtml}</ul>
        </div>

        <div class="section">
          <div class="section-title">Full Interview Conversation (${conversation.length} Turns)</div>
          ${turnsHtml}
        </div>
      </body>
    </html>
  `;

  const doc = printIframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(printIframe);
    return;
  }

  doc.open();
  doc.write(htmlDoc);
  doc.close();

  // Wait for fonts & layout then trigger print
  setTimeout(() => {
    printIframe.contentWindow?.focus();
    printIframe.contentWindow?.print();
    // Cleanup iframe after printing
    setTimeout(() => {
      if (document.body.contains(printIframe)) {
        document.body.removeChild(printIframe);
      }
    }, 1500);
  }, 300);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
