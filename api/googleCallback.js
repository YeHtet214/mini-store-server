import passport from "../auth/passport.js";
import * as UserService from "../services/userService.js";

const origins = ["https://mini-store-omega.vercel.app", "http://localhost:5173/auth/login"];

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', origins.join(", "));
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS method for CORS preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Respond OK to preflight
    }
    if (req.method === "GET") {
        passport.authenticate("google", async (err, user, info) => {
            if (err || !user) {
                return res.redirect("http://localhost:5173/auth/login?error=oauth_failed");
            }

            try {
                // Check if user exists
                const existingUser = await UserService.getUserByEmail(user.email);
                let token, user_id;

                if (existingUser) {
                    // Authenticate existing user
                    ({ token, user_id } = await UserService.authenticateUser(user.email, user.password));
                } else {
                    // Register new user
                    const role = user.email === "yhtet1934@gmail.com" ? 'admin' : 'user';
                    ({ token, user_id } = await UserService.registerUser(user.name, user.email, user.password, role));
                }

                res.redirect(`shttp://localhost:5173?token=${token}&uer_id=${user_id}`);

            } catch (error) {
                console.error("Error in Google callback:", error);
                return res.status(500).json({ msg: error.message });
            }
        })(req, res);
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
