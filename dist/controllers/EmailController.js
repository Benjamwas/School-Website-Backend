"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const emailModel_1 = require("../Models/emailModel");
const emailService_1 = require("../Services/emailService");
exports.EmailController = {
    contactform: async (req, res) => {
        try {
            const { name, email, subject, message } = req.body;
            const emailData = {
                name,
                email,
                subject,
                message,
                type: 'contact'
            };
            if (process.env.USE_DB === 'false') {
                await emailModel_1.EmailModel.createEmail(emailData);
            }
            await emailService_1.EmailService.sendEnquiryEmail(process.env.ENQUIRY_RECEIVER_EMAIL, 'New Contact Form Submission', `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`);
            res.status(200).json({ message: 'Contact form submitted successfully' });
            console.log('contactform processed successfully');
        }
        catch (error) {
            console.error('contactform error:', error);
            if (process.env.NODE_ENV === 'development') {
                return res.status(500).json({ error: 'Internal Server Error', details: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    schoolsform: async (req, res) => {
        try {
            const { name, email, phone, campus, message } = req.body;
            const emailData = {
                name,
                email,
                phone,
                campus,
                message,
                type: 'campus'
            };
            if (process.env.USE_DB === 'true') {
                await emailModel_1.EmailModel.createEmail(emailData);
            }
            await emailService_1.EmailService.sendCampusEmail(process.env.CAMPUS_RECEIVER_EMAIL, 'New Campus Form Submission', `<p>Name: ${name}</p><p>Email: ${email}</p><p>Phone: ${phone}</p><p>Campus: ${campus}</p><p>Message: ${message}</p>`);
            res.status(200).json({ message: 'Campus form submitted successfully' });
            console.log('campusform processed successfully');
        }
        catch (error) {
            console.error('campusform error:', error);
            if (process.env.NODE_ENV === 'development') {
                return res.status(500).json({ error: 'Internal Server Error', details: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    enrollmentform: async (req, res) => {
        try {
            const { name, email, phone, age, campus, message } = req.body;
            const emailData = {
                name,
                email,
                phone,
                age,
                campus,
                message,
                type: 'enrollment'
            };
            if (process.env.USE_DB === 'true') {
                await emailModel_1.EmailModel.createEmail(emailData);
            }
            await emailService_1.EmailService.sendEnrollmentEmail(process.env.ENROLLMENT_RECEIVER_EMAIL, 'New Enrollment Form Submission', `<p>Name: ${name}</p><p>Email: ${email}</p><p>Phone: ${phone}</p><p>Age: ${age}</p><p>Campus: ${campus}</p><p>Message: ${message}</p>`);
            res.status(200).json({ message: 'Enrollment form submitted successfully' });
        }
        catch (error) {
            console.error('enrollmentform error:', error);
            if (process.env.NODE_ENV === 'development') {
                return res.status(500).json({ error: 'Internal Server Error', details: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    listEmails: async (req, res) => {
        try {
            if (process.env.USE_DB !== 'true') {
                return res.status(501).json({ error: 'Database disabled (USE_DB!=true)' });
            }
            const emails = await emailModel_1.EmailModel.findAllEmails();
            res.status(200).json(emails);
        }
        catch (error) {
            console.error('listEmails error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
