/** Map site-specific free-text field names onto the universal `message` key. */
export function resolveLeadMessage(
  body: Record<string, unknown> | null | undefined
): string {
  if (!body || typeof body !== "object") return "";
  const keys = [
    "message",
    "Message",
    "description",
    "enquiry",
    "details",
    "summary",
    "notes",
    "matter",
    "caseSummary",
    "additionalInfo",
    "additional_info",
    "caseDetails",
    "enquiryDetails",
    "caseBrief",
    "case_summary",
    "caseDescription",
    "case_description",
    "matterDescription",
    "additionalNotes",
    "caseBackground",
    "specificQuestions",
    "briefSummary",
    "conflict_info",
    "brief",
  ];
  for (const key of keys) {
    if (body[key] != null && String(body[key]).trim()) {
      return String(body[key]).trim();
    }
  }
  return "";
}
