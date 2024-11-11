import { OAuth2Client } from 'google-auth-library';
import * as UserService from '../services/userService.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { token, password } = req.body;
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,  // Ensure you have the correct client ID
            });
            const payload = ticket.getPayload();
            const { email, name } = payload;

            // Check if user exists or create new user
            const isUserExist = await UserService.getUserByEmail(email);
            if (isUserExist) {
                const { token, user_id } = await UserService.authenticateUser(email, password);
                return res.json({ token, user_id });
            } else {
                const { token, user_id } = await UserService.registerUser(name, email, password, 'user');
                return res.json({ token, user_id });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Authentication failed' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
