"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailModel = void 0;
// Simple in-memory / noop EmailModel used when Prisma/DB are not required.
// This allows the app to run as an SMTP-forwarder only. If you later
// want persistence again, replace this with a real implementation.
exports.EmailModel = {
    createEmail: async (data) => {
        // Log the payload for debugging, but do not persist
        console.log('EmailModel.createEmail (noop):', data);
        return Promise.resolve(null);
    },
    findEmailById: async (id) => {
        return Promise.resolve(null);
    },
    findAllEmails: async () => {
        return Promise.resolve([]);
    },
    deleteEmailById: async (id) => {
        return Promise.resolve(null);
    },
    update: async (id, data) => {
        return Promise.resolve(null);
    }
};
