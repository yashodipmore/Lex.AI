import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(to: string, otp: string): Promise<void> {
  await transporter.sendMail({
    from: `"LexAI" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your LexAI Verification Code",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #111; margin: 0;">LexAI</h1>
          <p style="color: #666; font-size: 14px; margin-top: 4px;">AI Legal Agent</p>
        </div>
        <div style="background: #f9fafb; border-radius: 12px; padding: 32px; text-align: center;">
          <p style="color: #333; font-size: 15px; margin: 0 0 24px;">Your verification code is:</p>
          <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #111; font-family: monospace;">
            ${otp}
          </div>
          <p style="color: #999; font-size: 13px; margin: 24px 0 0;">Valid for 10 minutes. Do not share this code.</p>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 24px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  });
}

export default transporter;
