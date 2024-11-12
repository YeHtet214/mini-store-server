import passport from "../auth/passport.js";



export default function handler(req, res) {
    // CORS headers (for frontend communication only)
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight request for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === "GET") {
        // Trigger Google OAuth using Passport
        passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
