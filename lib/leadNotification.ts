import { SITE_NAME, SITE_URL } from "@/lib/site";

export const BRAND_NAME = SITE_NAME;

export type SubmitLeadInput = {
  fullName: string;
  email: string;
  phone?: string;
  formType?: "contact" | "instruct";
  /** Free-text enquiry body — always sent to n8n as `message`. */
  message?: string;
};

export type LeadWebhookPayload = {
  "Full Name": string;
  Email: string;
  "Phone Number": string;
  "Brand name": string;
  domain: string;
  message: string;
};

/** Hostname from NEXT_PUBLIC_SITE_URL, www stripped. */
export function getSiteDomain(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL;
  try {
    return new URL(raw).hostname.replace(/^www\./i, "");
  } catch {
    return new URL(SITE_URL).hostname.replace(/^www\./i, "");
  }
}

export function getLeadWebhookUrl(): string | undefined {
  return (
    process.env.Lead_notification_url ||
    process.env.LEAD_NOTIFICATION_URL ||
    undefined
  );
}

export function buildLeadWebhookPayload(
  input: SubmitLeadInput,
): LeadWebhookPayload {
  return {
    "Full Name": input.fullName.trim(),
    Email: input.email.trim().toLowerCase(),
    "Phone Number": (input.phone ?? "").trim(),
    "Brand name": BRAND_NAME,
    domain: getSiteDomain(),
    message: input.message ?? "",
  };
}

export async function notifyLeadWebhook(
  input: SubmitLeadInput,
): Promise<
  | { ok: true }
  | { ok: false; error: "WEBHOOK_MISSING" | "WEBHOOK_REJECTED" | "WEBHOOK_UNREACHABLE"; status?: number }
> {
  const webhookUrl = getLeadWebhookUrl();
  if (!webhookUrl) {
    return { ok: false, error: "WEBHOOK_MISSING" };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildLeadWebhookPayload(input)),
      signal: AbortSignal.timeout(12_000),
    });

    if (!res.ok) {
      return { ok: false, error: "WEBHOOK_REJECTED", status: res.status };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "WEBHOOK_UNREACHABLE" };
  }
}
