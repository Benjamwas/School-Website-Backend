import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { EmailService } from '../Services/emailService';

dotenv.config();

const to = process.env.TEST_EMAIL_TO || process.env.ENQUIRY_EMAIL_USER || 'recipient@example.com';
const subject = process.env.TEST_EMAIL_SUBJECT || 'Test email from Backend';
const html = process.env.TEST_EMAIL_HTML || '<p>This is a test email sent by testEmailService.ts</p>';

async function main() {
  // If an enquiry SMTP is configured, use the EmailService which uses the preconfigured transporter
  if (process.env.ENQUIRY_EMAIL_HOST && process.env.ENQUIRY_EMAIL_USER && process.env.ENQUIRY_EMAIL_PASS) {
    console.log('Using configured SMTP (ENQUIRY) — sending via EmailService.sendEnquiryEmail');
    await EmailService.sendEnquiryEmail(to, subject, html);
    console.log('Sent via configured SMTP to', to);
    return;
  }

  // Fallback: create an Ethereal test account and send directly
  console.log('No SMTP configured. Creating Ethereal test account...');
  const testAccount = await nodemailer.createTestAccount();

  const ethTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
    tls: {
      // allow self-signed in some dev environments (keeps script working behind strict proxies)
      rejectUnauthorized: false,
    },
  });

  const info = await ethTransporter.sendMail({
    from: `"Test" <${testAccount.user}>`,
    to,
    subject,
    html,
  });

  const preview = nodemailer.getTestMessageUrl(info);
  console.log('Ethereal message sent. Preview URL:', preview);
}

main().catch((err) => {
  console.error('testEmailService error', err);
  process.exit(1);
});
