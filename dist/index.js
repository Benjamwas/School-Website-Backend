"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const emailRoutes_1 = __importDefault(require("./Routes/emailRoutes"));
const app = (0, express_1.default)();
// --- STEP 1: Apply Middleware FIRST ---
// CORS must be the first thing the request hits
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Often needed if you handle cookies/sessions
}));
// Body parser must also be before routes so req.body is available in the route
app.use(express_1.default.json());
// --- STEP 2: Define Routes SECOND ---
// Now that CORS and JSON parsing are set up, define the routes
app.use("/api/emails", emailRoutes_1.default);
// --- STEP 3: Error Handling LAST ---
app.use((err, req, res, next) => {
    if (err) {
        console.error('Express body parse error:', err);
        if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
            return res.status(400).json({ error: 'Invalid JSON body' });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    return next();
});
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running successfully on port ${PORT}`);
    });
}
exports.default = app;
