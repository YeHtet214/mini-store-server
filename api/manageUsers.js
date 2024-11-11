import * as UserService from '../services/userService.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // or your specific origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'POST') {
        const userData = req.body;

        try {
            const createdUser = await UserService.createNewUserByAdmin(userData);
            return res.status(200).json(createdUser);
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Failed to create user' });
        }
    } else if (req.method === 'DELETE') {
        const { userId } = req.query;
        try {
            const deletedUser = await UserService.deleteUser(userId);
            if (!deletedUser) return res.status(401).json({ msg: 'Error deleting user' });
            return res.status(200).json(deletedUser);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Error deleting user' });
        }
    } else if (req.method === 'PUT') {
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
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}