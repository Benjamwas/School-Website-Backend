"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = exports.enrollmentTransporter = exports.schoolsTransporter = exports.enquiryTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// --- Configuration for ENQUIRY Transporter ---
exports.enquiryTransporter = nodemailer_1.default.createTransport({
    host: process.env.ENQUIRY_EMAIL_HOST,
    port: Number(process.env.ENQUIRY_EMAIL_PORT),
    secure: true,
    auth: {
        user: process.env.ENQUIRY_EMAIL_USER,
        pass: process.env.ENQUIRY_EMAIL_PASS
    },
    // TEMPORARY FIX: Add tls option to bypass self-signed certificate error in development.
    // **WARNING: DO NOT USE 'rejectUnauthorized: false' IN PRODUCTION without understanding the security risk.**
    tls: {
        rejectUnauthorized: false
    }
});
// --- Configuration for CAMPUS Transporter ---
exports.schoolsTransporter = nodemailer_1.default.createTransport({
    host: process.env.SCHOOLS_EMAIL_HOST,
    port: Number(process.env.SCHOOLS_EMAIL_PORT),
    secure: true,
    auth: {
        user: process.env.SCHOOLS_EMAIL_USER,
        pass: process.env.SCHOOLS_EMAIL_PASS // <--- CORRECT VARIABLE
    },
    tls: {
        rejectUnauthorized: false
    }
});
// --- Configuration for ENROLLMENT Transporter ---
exports.enrollmentTransporter = nodemailer_1.default.createTransport({
    host: process.env.ENROLLMENT_EMAIL_HOST,
    port: Number(process.env.ENROLLMENT_EMAIL_PORT),
    secure: true,
    auth: {
        user: process.env.ENROLLMENT_EMAIL_USER,
        pass: process.env.ENROLLMENT_EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
exports.EmailService = {
    // ... (rest of the EmailService object remains the same)
    sendEnquiryEmail: async (to, subject, html) => {
        try {
            if (process.env.DISABLE_EMAILS === 'true') {
                console.log('sendEnquiryEmail skipped (DISABLE_EMAILS=true)');
                return;
            }
            await exports.enquiryTransporter.sendMail({
                from: process.env.ENQUIRY_EMAIL_USER,
                to,
                subject,
                html
            });
        }
        catch (err) {
            console.error('sendEnquiryEmail error', err);
            throw err;
        }
    },
    sendCampusEmail: async (to, subject, html) => {
        try {
            if (process.env.DISABLE_EMAILS === 'true') {
                console.log('sendCampusEmail skipped (DISABLE_EMAILS=true)');
                return;
            }
            await exports.schoolsTransporter.sendMail({
                from: process.env.SCHOOLS_EMAIL_USER,
                to,
                subject,
                html
            });
        }
        catch (err) {
            console.error('sendCampusEmail error', err);
            throw err;
        }
    },
    sendEnrollmentEmail: async (to, subject, html) => {
        try {
            if (process.env.DISABLE_EMAILS === 'true') {
                console.log('sendEnrollmentEmail skipped (DISABLE_EMAILS=true)');
                return;
            }
            await exports.enrollmentTransporter.sendMail({
                from: process.env.ENROLLMENT_EMAIL_USER,
                to,
                subject,
                html
            });
        }
        catch (err) {
            console.error('sendEnrollmentEmail error', err);
            throw err;
        }
    }
};
