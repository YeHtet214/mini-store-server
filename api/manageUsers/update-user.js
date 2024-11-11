import * as UserService from '../../services/userService.js';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { id } = req.query;
        const userData = req.body;

        try {
            const updatedUser = await UserService.updateUserByAdmin(userData, id);
            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ error: 'Failed to update user' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
