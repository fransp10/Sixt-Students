import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const BRAND_COLOR = "#ff5f00";

function passwordResetTemplate(link: string) {
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

export async function sendPasswordResetEmail(to: string, link: string) {
  const { error } = await resend.emails.send({
    from: "Students App <no-reply@fransipekdev.me>",
    to,
    subject: "Reset your password",
    html: passwordResetTemplate(link),
    text: `Reset your password (valid 1 hour): ${link}\n\nIf you didn't request this, ignore this email.`,
  });
  if (error) throw new Error(`Email failed: ${error.message}`);
}
