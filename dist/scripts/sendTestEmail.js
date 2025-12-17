"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailService_1 = require("../Services/emailService");
async function run() {
    // If SMTP env is configured for enquiry, try using EmailService
    const hasSmtp = !!process.env.ENQUIRY_EMAIL_HOST && !!process.env.ENQUIRY_EMAIL_USER;
    if (hasSmtp) {
        console.log('Using configured SMTP via EmailService...');
        try {
            await emailService_1.EmailService.sendEnquiryEmail(process.env.ENQUIRY_RECEIVER_EMAIL || process.env.ENQUIRY_EMAIL_USER || 'recipient@example.com', 'Test email (configured SMTP)', '<p>This is a test using configured SMTP.</p>');
            console.log('Test email sent (via configured SMTP).');
        }
        catch (err) {
            console.error('Error sending test email via configured SMTP:', err);
            process.exitCode = 1;
        }
        return;
    }
    // Otherwise use nodemailer's Ethereal test account
    console.log('No SMTP configured. Creating Ethereal test account...');
    const testAccount = await nodemailer_1.default.createTestAccount();
    const transporter = nodemailer_1.default.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
        // In some environments a self-signed certificate or proxy can cause TLS failures.
        // For the ephemeral Ethereal test transport only, allow self-signed certs.
        tls: { rejectUnauthorized: false }
    });
    const info = await transporter.sendMail({
        from: 'Test <test@example.com>',
        to: 'recipient@example.com',
        subject: 'Ethereal test email from vendramini backend',
        html: '<p>Hello from Ethereal test</p>'
    });
    const preview = nodemailer_1.default.getTestMessageUrl(info);
    console.log('Ethereal message sent. Preview URL:', preview);
}
run().catch(err => {
    console.error('sendTestEmail script failed:', err);
    process.exit(1);
});
