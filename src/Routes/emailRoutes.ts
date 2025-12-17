import { Router } from "express";
import { EmailController } from "../controllers/EmailController";
import { EmailService } from "../Services/emailService";

const router = Router();

router.post('/contactform', EmailController.contactform);
router.post('/schoolsform', EmailController.schoolsform);
router.post('/enrollmentform', EmailController.enrollmentform);

// Dev/test endpoint to quickly verify SMTP transport without form payloads
router.get('/test-send', async (req, res) => {
	try {
		// Use receiver from env or fallback
		const to = process.env.ENQUIRY_RECEIVER_EMAIL || 'test@example.com';
		await EmailService.sendEnquiryEmail(to, 'Test Email from Backend', '<p>This is a test message from /api/emails/test-send</p>');
		return res.status(200).json({ message: 'Test email sent (or skipped if DISABLE_EMAILS=true)' });
	} catch (err) {
		console.error('test-send error:', err);
		return res.status(500).json({ error: (err as Error).message || String(err) });
	}
});

export default router;
         