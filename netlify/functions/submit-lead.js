/**
 * POST /api/submit-lead (via netlify.toml redirect) → n8n / webhook.
 * Outbound JSON: Full Name, Email, Phone Number, Brand name, domain, message.
 * Env: Lead_notification_url or LEAD_NOTIFICATION_URL; NEXT_PUBLIC_SITE_URL for domain.
 */
const BRAND_NAME = "FamilyCourtAccountant";
const FALLBACK_SITE_URL = "https://familycourtaccountant.com";

function getLeadWebhookUrl() {
  return (
    process.env.Lead_notification_url ||
    process.env.LEAD_NOTIFICATION_URL ||
    ""
  );
}

function getSiteDomain() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
  try {
    return new URL(raw).hostname.replace(/^www\./i, "");
  } catch {
    return new URL(FALLBACK_SITE_URL).hostname.replace(/^www\./i, "");
  }
}

/** Map site-specific free-text field names to universal `message`. */
function resolveLeadMessage(body) {
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

function buildPayload({ fullName, email, phone, message }) {
  return {
    "Full Name": fullName,
    Email: email,
    "Phone Number": phone,
    "Brand name": BRAND_NAME,
    domain: getSiteDomain(),
    message: message ?? "",
  };
}

exports.handler = async (event) => {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: jsonHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const fullName = String(body.fullName || body.full_name || "").trim();
  const email = String(body.email || "").trim();
  const phone = body.phone != null ? String(body.phone).trim() : "";
  const message = resolveLeadMessage(body);

  if (!fullName || !email) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "fullName and email are required" }),
    };
  }

  const webhookUrl = getLeadWebhookUrl();
  if (!webhookUrl) {
    return {
      statusCode: 503,
      headers: jsonHeaders,
      body: JSON.stringify({
        error: "WEBHOOK_MISSING",
        message: "Lead_notification_url / LEAD_NOTIFICATION_URL is not set.",
      }),
    };
  }

  let res;
  try {
    res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload({ fullName, email, phone, message })),
    });
  } catch {
    return {
      statusCode: 502,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "WEBHOOK_UNREACHABLE" }),
    };
  }

  if (!res.ok) {
    return {
      statusCode: 502,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "WEBHOOK_REJECTED", status: res.status }),
    };
  }

  return {
    statusCode: 200,
    headers: jsonHeaders,
    body: JSON.stringify({ ok: true }),
  };
};
