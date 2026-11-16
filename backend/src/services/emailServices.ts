import { readFileSync } from "node:fs";
import { CreateEmailOptions, Resend } from "resend";
import AppError from "../errors/AppError.js";

// Creates a new Resend client with the API key from the environment variable.
// Lazy initialization is used to avoid creating the client if email sending is not needed  in demo mode
function createResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

const BRAND_COLOR = "#ff5f00";

function passwordResetTemplate(link: string, username?: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:${BRAND_COLOR};padding:20px 32px;color:#ffffff;font-size:18px;font-weight:bold;">
                Students App
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#111827;">
                <h1 style="margin:0 0 16px;font-size:22px;">Reset your password</h1>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#374151;">
                  We received a request to reset your password. Click the button below to choose a new one.
                  This link is valid for <strong>1 hour</strong>.
                </p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#374151;">
                username: <strong>${username}</strong>
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:8px;background:${BRAND_COLOR};">
                      <a href="${link}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">
                        Reset password
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 8px;font-size:13px;color:#6b7280;">
                  If the button doesn't work, copy this link into your browser:
                </p>
                <p style="margin:0;font-size:13px;word-break:break-all;">
                  <a href="${link}" style="color:${BRAND_COLOR};">${link}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">
                If you didn't request this, you can safely ignore this email. Your password won't change.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendPasswordResetEmail(
  to: string,
  link: string,
  username: string,
) {
  const { error } = await deliver({
    from: "Students App <no-reply@fransipekdev.me>",
    to,
    subject: "Reset your password",
    html: passwordResetTemplate(link, username),
    text: `Reset your password (valid 1 hour): ${link}\n\nIf you didn't request this, ignore this email.`,
  });
  if (error) throw new Error(`Email failed: ${error.message}`);
}

// resolves to backend/assets from both src/services and dist/services
const LOGO = readFileSync(
  new URL("../../assets/sixtStudentsLogo.png", import.meta.url),
);
const LOGO_CID = "sixt-students-logo";

// "2026-10" -> "October 2026"
function formatMonth(month: string) {
  return new Date(`${month}-01T00:00:00Z`).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function contractReminderTemplate(
  monthLabel: string,
  link: string,
  firstName?: string,
) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td align="center" style="background:#111827;padding:20px 32px;border-bottom:4px solid ${BRAND_COLOR};">
                <img src="cid:${LOGO_CID}" alt="Sixt Students App" width="180" style="display:block;width:180px;max-width:100%;height:auto;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#111827;">
                <h1 style="margin:0 0 16px;font-size:22px;">Your contract for ${monthLabel} is missing</h1>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.5;color:#374151;">
                  Hi${firstName ? ` ${firstName}` : ""},
                </p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#374151;">
                  We haven't received your signed contract for <strong>${monthLabel}</strong> yet.
                  Please upload it in the Students App as soon as possible.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:8px;background:${BRAND_COLOR};">
                      <a href="${link}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">
                        Upload contract
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 8px;font-size:13px;color:#6b7280;">
                  If the button doesn't work, copy this link into your browser:
                </p>
                <p style="margin:0;font-size:13px;word-break:break-all;">
                  <a href="${link}" style="color:${BRAND_COLOR};">${link}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">
                If you've already uploaded this contract, you can ignore this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendContractReminderEmail(
  to: string,
  month: string,
  firstName?: string,
) {
  const monthLabel = formatMonth(month);
  const link = new URL(
    "/student/contracts",
    process.env.FRONTEND_URL,
  ).toString();

  const { error } = await deliver({
    from: "Students App <no-reply@fransipekdev.me>",
    to,
    subject: `Reminder: upload your contract for ${monthLabel}`,
    html: contractReminderTemplate(monthLabel, link, firstName),
    text: `Hi${firstName ? ` ${firstName}` : ""},\n\nWe haven't received your signed contract for ${monthLabel} yet. Please upload it here: ${link}\n\nIf you've already uploaded it, ignore this email.`,
    attachments: [
      { filename: "sixtStudentsLogo.png", content: LOGO, contentId: LOGO_CID },
    ],
  });
  if (error) throw new AppError(`Email failed: ${error.message}`, 500);
}

async function deliver(
  payload: CreateEmailOptions,
): Promise<{ error?: { message: string } | null }> {
  if (process.env.DEMO_MODE === "true") {
    console.log("Recipient:", payload.to);
    console.log("Subject:", payload.subject);
    return { error: null };
  }

  const { error } = await createResendClient().emails.send(payload);

  return { error };
}
