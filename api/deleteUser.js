import * as UserService from '../services/userService.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // or your specific origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'DELETE') {
        const { userId } = req.query;
        try {
            const deletedUser = await UserService.deleteUser(userId);
            if (!deletedUser) return res.status(401).json({ msg: 'Error deleting user' });
            return res.status(200).json(deletedUser);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Error deleting user' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
