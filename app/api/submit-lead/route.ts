import { NextResponse } from "next/server";
import { parseContactLead } from "@/lib/contact-lead";
import { notifyLeadWebhook } from "@/lib/leadNotification";
import {
  appendContactToSheet,
  appendInstructToSheet,
  writeSubmissionToSheetSafely,
} from "@/lib/sheetSubmissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/submit-lead
 * Webhook + Google Sheets — both soft-fail independently.
 * Succeeds when at least one destination works.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const lead = parseContactLead(body);

  if (!lead.fullName || !lead.email) {
    return NextResponse.json(
      { error: "fullName and email are required" },
      { status: 400 },
    );
  }

  const writtenToSheet = await writeSubmissionToSheetSafely(
    () =>
      lead.formType === "instruct"
        ? appendInstructToSheet(lead)
        : appendContactToSheet(lead),
    `submit-lead-${lead.formType}`,
  );

  const webhookResult = await notifyLeadWebhook({
    fullName: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    formType: lead.formType,
    message: lead.message,
  });

  const webhookOk = webhookResult.ok;
  const webhookMissing =
    !webhookOk && webhookResult.error === "WEBHOOK_MISSING";

  if (!webhookOk && !webhookMissing) {
    console.error("[submit-lead] webhook failed:", {
      error: webhookResult.error,
      status: webhookResult.status,
      email: lead.email,
      writtenToSheet,
    });
  }

  if (!webhookOk && webhookMissing) {
    console.warn("[submit-lead] Lead_notification_url not set");
  }

  if (!writtenToSheet && !webhookOk) {
    return NextResponse.json(
      {
        error: "LEAD_DESTINATION_MISSING",
        message:
          "Could not save your submission. Check Lead_notification_url and Google Sheets env vars on Netlify.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    forwarded: webhookOk,
    writtenToSheet,
  });
}
