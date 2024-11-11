import * as UserService from '../services/userService.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // or your specific origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'GET') {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json(users);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Error getting users' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
