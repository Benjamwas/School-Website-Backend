import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import dotenv from 'dotenv';
dotenv.config();

// --- Configuration for ENQUIRY Transporter ---
export const enquiryTransporter = nodemailer.createTransport({
    host:process.env.ENQUIRY_EMAIL_HOST,
    port:Number(process.env.ENQUIRY_EMAIL_PORT),
    secure:true,
    auth:{
        user:process.env.ENQUIRY_EMAIL_USER,
        pass:process.env.ENQUIRY_EMAIL_PASS
    },
    // TEMPORARY FIX: Add tls option to bypass self-signed certificate error in development.
    // **WARNING: DO NOT USE 'rejectUnauthorized: false' IN PRODUCTION without understanding the security risk.**
    tls: {
        rejectUnauthorized: false
    }
} as SMTPTransport.Options);

// --- Configuration for CAMPUS Transporter ---
export const schoolsTransporter = nodemailer.createTransport({
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
} as SMTPTransport.Options);

// --- Configuration for ENROLLMENT Transporter ---
export const enrollmentTransporter = nodemailer.createTransport({
    host:process.env.ENROLLMENT_EMAIL_HOST,
    port:Number(process.env.ENROLLMENT_EMAIL_PORT),
    secure:true,
    auth:{
        user:process.env.ENROLLMENT_EMAIL_USER,
        pass:process.env.ENROLLMENT_EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
} as SMTPTransport.Options);

export const EmailService = {
// ... (rest of the EmailService object remains the same)
    sendEnquiryEmail: async (to:string, subject:string, html:string) => {
         try {
             if (process.env.DISABLE_EMAILS === 'true') {
                 console.log('sendEnquiryEmail skipped (DISABLE_EMAILS=true)');
                 return;
             }
             await enquiryTransporter.sendMail({
                 from: process.env.ENQUIRY_EMAIL_USER,
                 to,
                 subject,
                 html
             });
         } catch (err) {
             console.error('sendEnquiryEmail error', err);
             throw err;
         }
    },
    sendCampusEmail: async (to:string, subject:string, html:string) => {
        try {
            if (process.env.DISABLE_EMAILS === 'true') {
                console.log('sendCampusEmail skipped (DISABLE_EMAILS=true)');
                return;
            }
            await schoolsTransporter.sendMail({
                from: process.env.SCHOOLS_EMAIL_USER,
                to,
                subject,
                html
            });
        } catch (err) {
            console.error('sendCampusEmail error', err);
            throw err;
        }
    },
    sendEnrollmentEmail: async (to:string, subject:string, html:string) => {
        try {
            if (process.env.DISABLE_EMAILS === 'true') {
                console.log('sendEnrollmentEmail skipped (DISABLE_EMAILS=true)');
                return;
            }
            await enrollmentTransporter.sendMail({
                from: process.env.ENROLLMENT_EMAIL_USER,
                to,
                subject,
                html
            });
        } catch (err) {
            console.error('sendEnrollmentEmail error', err);
            throw err;
        }
    }
};