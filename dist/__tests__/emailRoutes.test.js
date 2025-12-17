"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
// Mock the model and service modules to avoid DB and email side-effects
jest.mock('../Models/emailModel.ts', () => ({
    EmailModel: {
        createEmail: jest.fn().mockResolvedValue({}),
        findEmailById: jest.fn().mockResolvedValue(null),
        findAllEmails: jest.fn().mockResolvedValue([]),
        deleteEmailById: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({})
    }
}));
jest.mock('../Services/emailService.ts', () => ({
    EmailService: {
        sendEnquiryEmail: jest.fn().mockResolvedValue({}),
        sendCampusEmail: jest.fn().mockResolvedValue({}),
        sendEnrollmentEmail: jest.fn().mockResolvedValue({})
    }
}));
describe('Email routes', () => {
    it('POST /api/emails/contactform -> should return 200 and call services', async () => {
        const payload = {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Hello',
            message: 'This is a test'
        };
        const res = await (0, supertest_1.default)(index_1.default).post('/api/emails/contactform').send(payload).expect(200);
        expect(res.body).toHaveProperty('message');
    });
    it('POST /api/emails/campusform -> should return 200', async () => {
        const payload = {
            name: 'Campus User',
            email: 'campus@example.com',
            phone: '1234567890',
            campus: 'Main Campus',
            message: 'Campus test'
        };
        await (0, supertest_1.default)(index_1.default).post('/api/emails/campusform').send(payload).expect(200);
    });
    it('POST /api/emails/enrollmentform -> should return 200', async () => {
        const payload = {
            name: 'Enroll User',
            email: 'enroll@example.com',
            phone: '0987654321',
            age: 10,
            campus: 'North Campus',
            message: 'Enroll test'
        };
        await (0, supertest_1.default)(index_1.default).post('/api/emails/enrollmentform').send(payload).expect(200);
    });
});
