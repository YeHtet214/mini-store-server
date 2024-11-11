import * as UserService from '../services/userService.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS method for CORS preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Respond OK to preflight
    }

    if (req.method === 'POST') {
        const { name, email, password } = req.body;
        try {
            const newUser = await UserService.registerUser(name, email, password);
            if ((!newUser.token || !newUser.user_id) && newUser.status === 409) {
                return res.json({ msg: newUser.msg, status: newUser.status });
            }
            return res.json({ token: newUser.token, user_id: newUser.user_id });
        } catch (error) {
            console.log("There is an error on register");
            res.status(500).json({ msg: 'Error registering user' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
