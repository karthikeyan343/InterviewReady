/**
 * Utility to extract a clean, compact, interview-relevant resume context
 * from raw extracted resume text (PDF/DOCX).
 *
 * Deterministic processing without calling external LLMs.
 * Removes contact details, personal identifiers, and URLs.
 * Prioritizes: Projects > Technical Skills > Experience > Education > Certifications > Achievements.
 */

export interface CompactResumeSection {
  title: string;
  content: string;
}

export interface CompactResumeResult {
  formattedContext: string;
  hasContent: boolean;
  sectionsCount: number;
  totalLength: number;
}

// Limits per section (characters)
const SECTION_CHAR_LIMITS: Record<string, number> = {
  PROJECTS: 1200,
  "TECHNICAL SKILLS": 500,
  EXPERIENCE: 800,
  EDUCATION: 350,
  CERTIFICATIONS: 250,
  ACHIEVEMENTS: 250,
};

// Overall safety cap for total resume context (characters)
const MAX_TOTAL_CONTEXT_LENGTH = 2800;

/**
 * Strips emails, phone numbers, website/portfolio links, physical addresses,
 * and leftover separator tokens from a single line of text.
 */
export function sanitizeResumeLine(rawLine: string): string {
  if (!rawLine) return "";

  let cleaned = rawLine
    // Remove email addresses
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, "")
    // Remove phone numbers (international, US, Indian 10-digit, etc.)
    .replace(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}|\b\d{10,12}\b/g, "")
    // Remove URLs and portfolio/repo links
    .replace(/https?:\/\/[^\s]+|www\.[^\s]+|(?:linkedin\.com|github\.com|gitlab\.com|bitbucket\.org|kaggle\.com|leetcode\.com|portfolio)[^\s]*/gi, "");

  const trimmed = cleaned.trim();

  // Remove lines that explicitly identify contact details or physical location
  if (
    /^(?:address|location|residence|residential address|permanent address|current address|phone|mobile|tel|email|contact|e-mail)\s*[:\-]/i.test(
      trimmed
    )
  ) {
    return "";
  }

  // Check if line contains postal/pin code markers
  if (/\b(?:pincode|pin code|zip code|postal code)\b/i.test(trimmed)) {
    return "";
  }

  // Check if line is only leftover separator punctuation (e.g. "|", "•", "·", "-", "/", ",")
  const withoutSeparators = trimmed.replace(/[|•·\-,/\\:;()[\]{}<>\s]/g, "");
  if (withoutSeparators.length === 0) {
    return "";
  }

  return trimmed;
}

/**
 * Checks if a trimmed line is a recognized section heading.
 */
function identifySectionHeading(rawLine: string): string | null {
  const line = rawLine.trim();
  if (!line || line.length > 55) return null;

  // Clean decorative markers like "#", "*", "_", "-", "=", ":", bullet points
  const normalized = line
    .replace(/^[\s#*_\-=•·:;|]+/, "")
    .replace(/[\s#*_\-=•·:;|]+$/, "")
    .trim();

  if (!normalized) return null;

  // 1. Projects
  if (
    /^(?:projects?|key\s+projects?|academic\s+projects?|personal\s+projects?|selected\s+projects?|notable\s+projects?|technical\s+projects?|project\s+work|coursework\s+projects?)$/i.test(
      normalized
    )
  ) {
    return "PROJECTS";
  }

  // 2. Technical Skills
  if (
    /^(?:technical\s+skills?|skills\s*(?:&|and)\s*abilities|skills\s*(?:&|and)\s*tools|skills?|technologies|proficiencies|core\s+competencies|programming\s+languages|tools\s*(?:&|and)\s*technologies|areas\s+of\s+expertise|technical\s+proficiencies)$/i.test(
      normalized
    )
  ) {
    return "TECHNICAL SKILLS";
  }

  // 3. Work / Internship Experience
  if (
    /^(?:work\s+experience|professional\s+experience|experience|employment(?:\s+history)?|internships?(?:\s+experience)?|work\s+history|industry\s+experience)$/i.test(
      normalized
    )
  ) {
    return "EXPERIENCE";
  }

  // 4. Education
  if (
    /^(?:education|academic\s+background|academic\s+credentials|academic\s+qualifications|academics|qualifications)$/i.test(
      normalized
    )
  ) {
    return "EDUCATION";
  }

  // 5. Certifications
  if (
    /^(?:certifications?|certificates?|licenses?\s*(?:&|and)\s*certifications?|courses?\s*(?:&|and)\s*certifications?|professional\s+certifications?)$/i.test(
      normalized
    )
  ) {
    return "CERTIFICATIONS";
  }

  // 6. Achievements
  if (
    /^(?:achievements?|awards?\s*(?:&|and)\s*achievements?|honors?\s*(?:&|and)\s*awards?|accomplishments?|publications?|extracurricular(?:\s+activities)?)$/i.test(
      normalized
    )
  ) {
    return "ACHIEVEMENTS";
  }

  // Ignored sections (personal details, summary, objective, references, hobbies, etc.)
  if (
    /^(?:summary|career\s+objective|professional\s+summary|objective|profile|about\s+me|personal\s+details|contact(?:\s+information)?|references|declaration|hobbies|interests|languages(?:\s+known)?)$/i.test(
      normalized
    )
  ) {
    return "IGNORED";
  }

  return null;
}

/**
 * Formats a list of lines for a section within its allocated character budget,
 * preserving whole lines rather than truncating mid-sentence.
 */
function fitLinesToBudget(lines: string[], maxChars: number): string {
  const selectedLines: string[] = [];
  let currentLength = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Avoid adjacent duplicate lines
    if (selectedLines.length > 0 && selectedLines[selectedLines.length - 1] === trimmed) {
      continue;
    }

    if (currentLength + trimmed.length + 1 > maxChars) {
      break;
    }

    selectedLines.push(trimmed);
    currentLength += trimmed.length + 1;
  }

  return selectedLines.join("\n");
}

/**
 * Extracts a compact, interview-relevant resume context from raw extracted text.
 * Priority: Projects > Technical Skills > Experience > Education > Certifications > Achievements.
 */
export function extractCompactResumeContext(rawText: string): string {
  if (!rawText || typeof rawText !== "string") {
    return "";
  }

  const lines = rawText.split(/\r?\n/);
  const sectionsData: Record<string, string[]> = {
    PROJECTS: [],
    "TECHNICAL SKILLS": [],
    EXPERIENCE: [],
    EDUCATION: [],
    CERTIFICATIONS: [],
    ACHIEVEMENTS: [],
  };

  let currentSection: string | null = null;
  const seenLines = new Set<string>();

  for (const rawLine of lines) {
    const identifiedSection = identifySectionHeading(rawLine);

    if (identifiedSection) {
      currentSection = identifiedSection;
      continue;
    }

    // Skip content if we haven't hit a valid section or if in an ignored section
    if (!currentSection || currentSection === "IGNORED") {
      continue;
    }

    const sanitized = sanitizeResumeLine(rawLine);
    if (!sanitized) {
      continue;
    }

    // Deduplicate exact repeating lines
    const lineKey = sanitized.toLowerCase();
    if (seenLines.has(lineKey)) {
      continue;
    }
    seenLines.add(lineKey);

    if (sectionsData[currentSection]) {
      sectionsData[currentSection].push(sanitized);
    }
  }

  // Count total extracted lines across relevant sections
  const totalExtractedLines = Object.values(sectionsData).reduce(
    (sum, linesArr) => sum + linesArr.length,
    0
  );

  // Fallback: If no standard section headers were recognized, extract cleaned text deterministically
  if (totalExtractedLines === 0) {
    const fallbackLines: string[] = [];
    let fallbackCharCount = 0;
    const fallbackSeen = new Set<string>();

    for (const rawLine of lines) {
      const sanitized = sanitizeResumeLine(rawLine);
      if (!sanitized) continue;

      const lower = sanitized.toLowerCase();
      if (fallbackSeen.has(lower)) continue;
      fallbackSeen.add(lower);

      // Skip generic CV header markers
      if (/^(?:curriculum\s+vitae|resume|biodata|bio-data)$/i.test(sanitized)) {
        continue;
      }

      if (fallbackCharCount + sanitized.length + 1 > 1600) {
        break;
      }

      fallbackLines.push(sanitized);
      fallbackCharCount += sanitized.length + 1;
    }

    if (fallbackLines.length === 0) {
      return "";
    }

    return `RELEVANT RESUME DETAILS:\n${fallbackLines.join("\n")}`;
  }

  // Priority order for building the final context
  const priorityOrder: Array<{ name: string; key: keyof typeof sectionsData }> = [
    { name: "PROJECTS", key: "PROJECTS" },
    { name: "TECHNICAL SKILLS", key: "TECHNICAL SKILLS" },
    { name: "EXPERIENCE", key: "EXPERIENCE" },
    { name: "EDUCATION", key: "EDUCATION" },
    { name: "CERTIFICATIONS", key: "CERTIFICATIONS" },
    { name: "ACHIEVEMENTS", key: "ACHIEVEMENTS" },
  ];

  const formattedSections: string[] = [];
  let totalLength = 0;

  for (const { name, key } of priorityOrder) {
    const sectionLines = sectionsData[key];
    if (!sectionLines || sectionLines.length === 0) {
      continue;
    }

    const limit = SECTION_CHAR_LIMITS[key] || 500;
    const remainingBudget = Math.max(0, MAX_TOTAL_CONTEXT_LENGTH - totalLength);

    if (remainingBudget <= 100) {
      break;
    }

    const effectiveLimit = Math.min(limit, remainingBudget);
    const content = fitLinesToBudget(sectionLines, effectiveLimit);

    if (!content.trim()) {
      continue;
    }

    const sectionBlock = `${name}:\n${content}`;
    formattedSections.push(sectionBlock);
    totalLength += sectionBlock.length + 2; // account for newlines
  }

  return formattedSections.join("\n\n").trim();
}
