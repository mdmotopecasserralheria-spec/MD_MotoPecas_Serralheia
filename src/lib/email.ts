import nodemailer from 'nodemailer'

function criarTransporte() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASS obrigatórios no .env.local')
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
  const transport = criarTransporte()
  await transport.sendMail({
    from: `"MD Moto Peças" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  })
}
