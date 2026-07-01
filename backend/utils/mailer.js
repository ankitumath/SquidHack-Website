import nodemailer from "nodemailer";

/**
 * Shared SMTP transporter
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  family: 4, // Force IPv4
});

// Verify SMTP connection when the server starts
try {
  await transporter.verify();
  console.log("✅ SMTP verified successfully");
} catch (error) {
  console.error("❌ SMTP verification failed:", error.message);
}

/**
 * Sends a registration status email to the team leader.
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.teamName
 * @param {string} options.leaderName
 * @param {string} options.teamId
 * @param {string} options.status
 * @param {string} [options.reason]
 */
export const sendStatusEmail = async ({
  to,
  teamName,
  leaderName,
  teamId,
  status,
  reason,
}) => {
  const isApproved = status === "Approved";

  const subject = isApproved
    ? `✅ SquidHack 2026 — Finalist Spot Confirmed! [${teamId}]`
    : `⚠️ SquidHack 2026 — Registration Status Update [${teamId}]`;

  const htmlBody = isApproved
    ? `
      <div style="font-family:sans-serif;background:#0a0a0a;color:#ffffff;padding:40px;max-width:600px;margin:auto;border:1px solid #f9004d;">
        <h1 style="color:#f9004d;font-size:28px;letter-spacing:4px;text-transform:uppercase;margin-bottom:4px;">SQUID HACK 2026</h1>
        <p style="color:#888;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:0;">Finalist Confirmation</p>

        <hr style="border-color:#1a1a1a;margin:24px 0;" />

        <p style="font-size:14px;color:#aaa;">
          Congratulations,
          <strong style="color:#fff">${leaderName}</strong>!
        </p>

        <p style="font-size:14px;color:#aaa;">
          Your team
          <strong style="color:#f9004d">${teamName}</strong>
          has been
          <strong style="color:#22c55e">VERIFIED & APPROVED</strong>
          as an official SquidHack 2026 Finalist.
        </p>

        <div style="background:#111;border:1px solid #f9004d22;padding:16px;margin:24px 0;border-radius:4px;">
          <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:2px;">
            Team ID
          </p>
          <p style="margin:4px 0 0;font-size:20px;color:#f9004d;font-weight:bold;letter-spacing:3px;">
            ${teamId}
          </p>
        </div>

        <p style="font-size:14px;color:#aaa;">
          📅 <strong style="color:#fff">Event Date:</strong> August 1st, 2026
        </p>

        <p style="font-size:14px;color:#aaa;">
          📍 <strong style="color:#fff">Venue:</strong> SAGE University, Indore
        </p>

        <hr style="border-color:#1a1a1a;margin:24px 0;" />

        <p style="font-size:12px;color:#555;">
          Outplay. Outcode. Survive. — Team SquidHack
        </p>
      </div>
    `
    : `
      <div style="font-family:sans-serif;background:#0a0a0a;color:#ffffff;padding:40px;max-width:600px;margin:auto;border:1px solid #333;">
        <h1 style="color:#f9004d;font-size:28px;letter-spacing:4px;text-transform:uppercase;margin-bottom:4px;">SQUID HACK 2026</h1>

        <p style="color:#888;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:0;">
          Registration Status Update
        </p>

        <hr style="border-color:#1a1a1a;margin:24px 0;" />

        <p style="font-size:14px;color:#aaa;">
          Greetings,
          <strong style="color:#fff">${leaderName}</strong>.
        </p>

        <p style="font-size:14px;color:#aaa;">
          We regret to inform you that the registration for team
          <strong style="color:#fff">${teamName}</strong>
          (ID:
          <strong style="color:#f9004d">${teamId}</strong>)
          has been
          <strong style="color:#ef4444">REJECTED</strong>
          due to a payment validation issue.
        </p>

        ${
          reason
            ? `
          <div style="background:#1a0a0a;border-left:3px solid #ef4444;padding:12px 16px;margin:20px 0;border-radius:2px;">
            <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
              Reason
            </p>
            <p style="margin:0;font-size:13px;color:#fca5a5;">
              ${reason}
            </p>
          </div>
        `
            : ""
        }

        <p style="font-size:14px;color:#aaa;">
          Please reach out to the SCYP coordinators immediately to resolve this issue.
        </p>

        <hr style="border-color:#1a1a1a;margin:24px 0;" />

        <p style="font-size:12px;color:#555;">
          Team SquidHack — SAGE University, Indore
        </p>
      </div>
    `;

  const mailOptions = {
    from: `"SquidHack 2026" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: htmlBody,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("✅ Email sent:", info.messageId);

  return info;
};