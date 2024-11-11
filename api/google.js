import passport from "../auth/passport.js";

const origins = ["https://mini-store-omega.vercel.app", "http://localhost:5173"];

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', origins.join(", "));
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS method for CORS preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Respond OK to preflight
    }

    if (req.method === "GET") {
        // Trigger Google OAuth using Passport
        passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
