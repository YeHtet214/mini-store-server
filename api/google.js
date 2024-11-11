import passport from "../auth/passport";

export default function handler(req, res) {
    if (req.method === "GET") {
        // Trigger Google OAuth using Passport
        passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
