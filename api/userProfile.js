import * as UserService from '../services/userService.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // or your specific origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'GET') {
        const token = req.headers.authorization?.split(" ")[1]; // Assume token is passed as Bearer token
        if (!token) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        try {
            const user = await UserService.verifyToken(token); // Implement token verification in your UserService
            const userData = await UserService.getUserDataById(user.id);
            if (!userData) return res.status(401).json({ msg: 'Something went wrong fetching user data' });

            const { name, email, user_id } = userData;
            return res.status(200).json({ name, email, user_id });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Error fetching user profile' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
