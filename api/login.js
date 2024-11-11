import * as UserService from '../services/userService.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // or your specific origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'POST') {
        const { email, password } = req.body;
        try {
            const { token, user_id } = await UserService.authenticateUser(email, password);
            return res.json({ token, user_id });
        } catch (err) {
            if (err.message === 'Email not found') {
                res.status(400).json({ message: 'Email not found' });
            } else if (err.message === 'Incorrect Password') {
                res.status(401).json({ message: 'Incorrect Password' });
            } else {
                res.status(500).send("Server error");
            }
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
