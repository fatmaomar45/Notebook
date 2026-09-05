import nodemailer from 'nodemailer';

interface SendResetOptions {
  to: string;
  resetUrl: string;
  ttlMinutes: number;
}

function makeTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !port || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendResetEmail({ to, resetUrl, ttlMinutes }: SendResetOptions): Promise<{ delivered: boolean; preview?: string }> {
  const transporter = makeTransporter();
  const from = process.env.SMTP_FROM || 'no-reply@notebook.local';

  if (!transporter) {
    console.log(`[RESET] (dev) Email to ${to}: ${resetUrl} (expires in ${ttlMinutes} min)`);
    return { delivered: false, preview: resetUrl };
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject: 'Reset your Notebook password',
      text: `Reset your password using this link: ${resetUrl}\nThis link expires in ${ttlMinutes} minutes.`,
      html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in ${ttlMinutes} minutes.</p>`,
    });
  } catch (error) {
    console.error('[RESET] Email delivery failed, falling back to dev mode:', error);
    console.log(`[RESET] (dev) Email to ${to}: ${resetUrl} (expires in ${ttlMinutes} min)`);
    return { delivered: false, preview: resetUrl };
  }

  return { delivered: true };
}
