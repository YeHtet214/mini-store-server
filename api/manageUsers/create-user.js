import * as UserService from '../../services/userService.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const userData = req.body;

        try {
            const createdUser = await UserService.createNewUserByAdmin(userData);
            return res.status(200).json(createdUser);
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Failed to create user' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
