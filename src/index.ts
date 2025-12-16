import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import emailRoutes from "./Routes/emailRoutes.ts"; 

const app = express();

// --- STEP 1: Apply Middleware FIRST ---

// CORS must be the first thing the request hits
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET','POST','PUT','DELETE','PATCH'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true // Often needed if you handle cookies/sessions
}));

// Body parser must also be before routes so req.body is available in the route
app.use(express.json());

// --- STEP 2: Define Routes SECOND ---

// Now that CORS and JSON parsing are set up, define the routes
app.use("/api/emails", emailRoutes);

// --- STEP 3: Error Handling LAST ---

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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

export default app;