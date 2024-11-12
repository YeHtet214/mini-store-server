import * as UserService from '../services/userService.js';
import {verifyToken} from "../auth/auth.js";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // or your specific origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE', 'OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            await verifyToken(req);
            const userData = await UserService.getUserDataById(req.user.id);
            if (!userData) return res.status(401).json({ msg: 'Something went wrong fetching user data' });

            const { name, email, user_id } = userData;
            return res.status(200).json({ name, email, user_id });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: err.msg || 'Error fetching user profile' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
