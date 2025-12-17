"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EmailController_1 = require("../controllers/EmailController");
const emailService_1 = require("../Services/emailService");
const router = (0, express_1.Router)();
router.post('/contactform', EmailController_1.EmailController.contactform);
router.post('/schoolsform', EmailController_1.EmailController.schoolsform);
router.post('/enrollmentform', EmailController_1.EmailController.enrollmentform);
// Dev/test endpoint to quickly verify SMTP transport without form payloads
router.get('/test-send', async (req, res) => {
    try {
        // Use receiver from env or fallback
        const to = process.env.ENQUIRY_RECEIVER_EMAIL || 'test@example.com';
        await emailService_1.EmailService.sendEnquiryEmail(to, 'Test Email from Backend', '<p>This is a test message from /api/emails/test-send</p>');
        return res.status(200).json({ message: 'Test email sent (or skipped if DISABLE_EMAILS=true)' });
    }
    catch (err) {
        console.error('test-send error:', err);
        return res.status(500).json({ error: err.message || String(err) });
    }
});
exports.default = router;
